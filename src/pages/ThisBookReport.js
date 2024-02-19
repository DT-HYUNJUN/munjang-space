import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import getBooks from "../utils/getBooks";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styled from "styled-components";

import { collection, onSnapshot, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../fbase";

const ThisBookReport = () => {
  const [data, setData] = useState({});
  const { isbn13 } = useParams();
  const [bookReports, setBookReports] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const goToReport = (email, id) => {
    navigate(`/report/${email}/${id}`);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "reports"), async (snapshot) => {
      const reports = [];
      for (const doc of snapshot.docs) {
        const booksCollectionRef = collection(doc.ref, "books");
        const q = query(booksCollectionRef, where("book.isbn13", "==", isbn13), orderBy("date", "desc"), where("isPrivate", "==", false));
        const booksQuerySnapshot = await getDocs(q);

        booksQuerySnapshot.forEach((bookData) => {
          const bookInfo = bookData.data();
          const titleWithoutTags = bookInfo.content.replace(/(<([^>]+)>)/gi, "");
          reports.push({
            id: bookData.id,
            title: bookInfo.title,
            content: titleWithoutTags,
            email: bookInfo.author,
            username: bookInfo.username,
            profileImage: bookInfo.profileImage,
            date: bookInfo.date,
          });
        });
      }

      setBookReports(reports);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isbn13]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getBookReports(isbn13), getBooks(isbn13)])
      .then(([reports, books]) => {
        setBookReports(reports);
        setData(books[0]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isbn13]);

  const getBookReports = async (isbn13) => {
    const reportsCollectionRef = collection(db, "reports");
    const q = query(reportsCollectionRef, where("book.isbn13", "==", isbn13), orderBy("date", "desc"), where("isPrivate", "==", false));
    const querySnapshot = await getDocs(q);
    const reports = [];

    querySnapshot.forEach((doc) => {
      const reportData = doc.data();
      const { title, content, author, username, profileImage, date } = reportData.book;
      const titleWithoutTags = content.replace(/(<([^>]+)>)/gi, "");
      reports.push({
        id: doc.id,
        title,
        content: titleWithoutTags,
        email: author,
        username,
        profileImage,
        date,
      });
    });

    return reports;
  };

  return (
    <div>
      {loading ? (
        <LoadingWrapper>
          <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        </LoadingWrapper>
      ) : (
        <div>
          <div>
            <ReportLength>📚 해당 독후감은 총 {bookReports.length}개 입니다.</ReportLength>
          </div>
          <ThisBookReports>
            {bookReports.map((report, index) => (
              <BookReport key={index} onClick={() => goToReport(report.email, report.id)}>
                <ReportTitle>{report.title}</ReportTitle>
                <ReportContent>{report.content}</ReportContent>
                <ReportFooter>
                  <ReportAuthorProfileImage src={report.profileImage} alt={report.username} />
                  <ReportAuthor>{report.username}</ReportAuthor>
                </ReportFooter>
              </BookReport>
            ))}
          </ThisBookReports>
        </div>
      )}
    </div>
  );
};

export default ThisBookReport;

const ThisBookReports = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  padding-left: 50px;
  padding-right: 50px;
`;

const BookReport = styled.div`
  border-radius: 3%;
  width: 300px;
  height: 230px;
  margin-right: 20px;
  text-align: center;
  background-color: #a7d7e8;
  box-shadow: 12px 0px 11px -3px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  margin-bottom: 20px;

  font-family: "KyoboHandwriting2021sjy";
`;

const ReportTitle = styled.div`
  font-family: "UhBeeJJIBBABBA";
  font-weight: bold;
  font-size: 18px;
  height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px 14px 0px 14px;
`;

const ReportContent = styled.div`
  border-bottom: 1px solid white;
  padding: 10px;
  height: 132px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
`;

const ReportFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  padding-top: 5px;
`;

const ReportAuthor = styled.span`
  text-align: center;
  bottom: 0;
`;

const ReportAuthorProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 75px;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ReportLength = styled.h1`
  font-family: "UhBeeJJIBBABBA";

  margin-top: 0px;
  margin-left: 50px;
  text-align: left;

  color: gray;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
