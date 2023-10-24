import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

import getBooks from "../utils/getBooks";
import MyButton from "../components/MyButton";

import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../fbase";

const Book = () => {
  const { isbn13 } = useParams();

  const [data, setData] = useState({});

  const [bookTitle, setBookTitle] = useState("");

  const [bookReports, setBookReports] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      getBookReports(isbn13);
      getBooks(isbn13).then((res) => {
        setData(res[0]);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // 데이터에 값이 있으면 -> 렌더링
  // 데이터에 값이 없으면 -> loading

  const handleBookClick = (title, cover, author, description, isbn13) => {
    setBookTitle(title);
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
    const reportsCollectionRef = collection(db, "reports");
    const allReports = [];

    // 모든 계정을 탐색하기 위한 코드
    onSnapshot(reportsCollectionRef, (snapshot) => {
      // 각 계정을 탐색
      snapshot.docChanges().forEach(async (change) => {
        // 각 계정에서 변화가 일어날 때 작동하기 위한 조건문
        if (change.type === "added" || change.type === "modified") {
          const doc = change.doc;

          // 접근한 계정이 작성한 독후감 경로
          const booksCollectionRef = collection(doc.ref, "books");
          const q = query(
            booksCollectionRef,
            where("book.isbn13", "==", isbn13)
          );
          const booksQuerySnapshot = await getDocs(q);

          booksQuerySnapshot.forEach((bookData) => {
            const bookInfo = bookData.data();
            const titleOutTags = bookInfo.title.replace(/(<([^>]+)>)/gi, "");

            allReports.push({
              id: bookData.id,
              title: titleOutTags,
              content: titleOutTags,
              author: bookInfo.author,
            });
          });

          setBookReports(allReports);
        }
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

        <div>
          <BookIntroduction>책소개</BookIntroduction>

          <BookIntroductionContent>{data.description}</BookIntroductionContent>
        </div>

        <ThisReport>이 책의 독후감</ThisReport>
        <ThisBookReport>
          {bookReports.map((report) => (
            <BookReport key={report.id}>
              <ReportTitle>{report.title}</ReportTitle>
              <ReportContent>{report.content}</ReportContent>
              <ReportFooter>
                <img src="" alt="" />
                <ReportAuthor>{report.author}</ReportAuthor>
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
`;

const BookIntroduction = styled.h1`
  /* border-bottom: 1px solid #e2e2e2; */

  margin-bottom: 20px;
  margin-top: 50px;
`;

const BookIntroductionContent = styled.p`
  font-size: 20px;
  text-align: left;
`;

const ThisReport = styled.h1`
  /* border-bottom: 1px solid #e2e2e2; */

  margin-bottom: 20px;
  margin-top: 50px;
`;
const BookReport = styled.div`
  border: 1px solid yellow;
  border-radius: 15%;

  width: 200px;
  height: 200px;

  margin-right: 20px;

  text-align: center;

  background-color: #fffb99;
  box-shadow: 12px 0px 11px -3px rgba(0, 0, 0, 0.1);
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

const ReportTitle = styled.p`
  font-weight: bold;
  font-size: 20px;
`;

const ReportContent = styled.p``;

const ReportFooter = styled.div`
  position: sticky;
`;

const ReportAuthor = styled.p`
  text-align: center;
  bottom: 0;
`;
