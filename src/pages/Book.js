import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

import getBooks from "../utils/getBooks";
import MyButton from "../components/MyButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../fbase";

const Book = () => {
  const { isbn13 } = useParams();

  const [data, setData] = useState({});

  const [bookReports, setBookReports] = useState([]);

  const navigate = useNavigate();

  const goToThisBookReport = () => {
    navigate(`/thisbookreport/${isbn13}`);
  };

  const goToReport = (email, id) => {
    navigate(`/report/${email}/${id}`);
  };

  useEffect(() => {
    try {
      getBookReports(isbn13).then((res) => {
        setBookReports(res.sort((a, b) => parseInt(b.date) - parseInt(a.date)));
      });
      getBooks(isbn13).then((res) => {
        setData(res[0]);
      });
    } catch (error) {
      console.log(error);
    }
  }, [isbn13]);

  // 데이터에 값이 있으면 -> 렌더링
  // 데이터에 값이 없으면 -> loading

  const handleBookClick = (title, cover, author, description, isbn13) => {
    navigate("/new", {
      state: {
        title: title,
        cover: cover,
        author: author,
        description: description,
        isbn13: isbn13,
      },
    });
  };

  const getBookReports = async (isbn13) => {
    return new Promise(async (resolve, reject) => {
      const reportsCollectionRef = collection(db, "reports");
      const allReports = [];

      onSnapshot(reportsCollectionRef, async (snapshot) => {
        const promises = snapshot.docChanges().map(async (change) => {
          if (change.type === "added" || change.type === "modified") {
            const doc = change.doc;
            const booksCollectionRef = collection(doc.ref, "books");
            const q = query(
              booksCollectionRef,
              where("book.isbn13", "==", isbn13),
              orderBy("date", "desc"),
              where("isPrivate", "==", false)
            );
            const booksQuerySnapshot = await getDocs(q);

            booksQuerySnapshot.forEach((bookData) => {
              const bookInfo = bookData.data();
              const titleOutTags = bookInfo.content.replace(
                /(<([^>]+)>)/gi,
                ""
              );

              allReports.push({
                id: bookData.id,
                title: bookInfo.title,
                content: titleOutTags,
                email: bookInfo.author,
                username: bookInfo.username,
                profileImage: bookInfo.profileImage,
                date: bookInfo.date,
              });
            });
          }
        });
        await Promise.all(promises); // 여러 개의 Promise를 병렬로 처리한 후, 모든 Promise가 완료되면 결과를 반환합니다.
        resolve(allReports);
      });
    });
  };

  if (data) {
    return (
      <BookDetailEntire>
        <BookContent>
          <BookCover src={data.cover} alt="bookcover" />
          <div>
            <BookTitle>{data.title}</BookTitle>
            <BookAuthor>{data.author}</BookAuthor>
            <BookCategory>{data.categoryName}</BookCategory>
            <div>
              <MyButton
                type={"positive"}
                text={"종이책 구매"}
                onClick={() => {
                  window.location.href = data.link;
                }}
              />
              <WriteButton
                onClick={() =>
                  handleBookClick(
                    data.title,
                    data.cover,
                    data.author,
                    data.description,
                    data.isbn13
                  )
                }
              >
                독후감 작성하기
              </WriteButton>
            </div>
          </div>
        </BookContent>

        <BookIntroWrapper>
          <BookIntroduction>책소개</BookIntroduction>
          <BookIntroductionContent>{data.description}</BookIntroductionContent>
        </BookIntroWrapper>

        <ThisReportWrapper>
          <ThisReport>이 책의 독후감</ThisReport>
          <FontAwesomeIcon
            onClick={goToThisBookReport}
            icon={faArrowRight}
            cursor={"pointer"}
          />
        </ThisReportWrapper>

        <ThisBookReport>
          {bookReports.slice(0, 5).map((report, idx) => (
            <BookReport
              key={idx}
              onClick={() => goToReport(report.email, report.id)}
            >
              <ReportTitle>{report.title}</ReportTitle>
              <ReportContent>{report.content}</ReportContent>
              <ReportFooter>
                <ReportAuthorProfileImage
                  src={report.profileImage}
                  alt={report.username}
                />
                <ReportAuthor>{report.username}</ReportAuthor>
              </ReportFooter>
            </BookReport>
          ))}
        </ThisBookReport>
      </BookDetailEntire>
    );
  } else {
    return <div>loading...</div>;
  }
};

export default Book;

const BookDetailEntire = styled.div`
  font-family: "KyoboHandwriting2021sjy";
`;

const BookContent = styled.div`
  display: flex;
  gap: 100px;
`;

const BookTitle = styled.p`
  font-size: 35px;
  font-weight: bold;

  margin-top: 0px;
  margin-bottom: 0px;
`;

const BookAuthor = styled.p`
  font-size: 20px;
  color: gray;
`;

const BookCategory = styled.p`
  font-size: 15px;
  color: gray;
`;

const BookCover = styled.img`
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  margin-left: 30px;

  margin-bottom: 30px;
`;

const BookIntroduction = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`;

const BookIntroductionContent = styled.p`
  font-size: 20px;
  text-align: left;
`;

const ThisReport = styled.h1`
  margin-bottom: 20px;
`;
const BookReport = styled.div`
  border-radius: 15%;

  width: 230px;
  height: 230px;

  margin-right: 20px;

  text-align: center;

  background-color: #ededed;
  box-shadow: 12px 0px 11px -3px rgba(0, 0, 0, 0.1);

  cursor: pointer;
`;

const WriteButton = styled.button`
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  background-color: #fffb85;
  width: 120px;
  height: 52px;

  font-family: "UhBeeJJIBBABBA";
  font-size: 14px;

  color: black;

  margin-left: 20px;
  padding: 10px 15px;
  white-space: nowrap;
  &:hover {
    background-color: #f7f25e;
  }
`;

const ThisBookReport = styled.div`
  display: flex;
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
  border-bottom: 1px solid #ccc;

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

const ThisReportWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;

  border-top: 4px solid #ececec;
`;

const BookIntroWrapper = styled.div`
  border-top: 4px solid #ececec;
`;
