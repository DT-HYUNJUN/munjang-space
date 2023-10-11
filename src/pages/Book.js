import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

import getBooks from "../utils/getBooks";
import MyButton from "../components/MyButton";

const Book = () => {
  const { isbn13 } = useParams();

  const [data, setData] = useState({});

  const [bookTitle, setBookTitle] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    try {
      getBooks(isbn13).then((res) => {
        setData(res[0]);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // 데이터에 값이 있으면 -> 렌더링
  // 데이터에 값이 없으면 -> loading

  // const handleBookClick = () => {
  //   const updateTitle = data.title;
  //   setBookTitle(updateTitle);
  //   console.log(updateTitle);
  // };

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

  if (data) {
    return (
      <BookDetailEntire>
        <BookContent>
          <BookCover src={data.cover} alt="bookcover" />
          <div>
            <BookTitle>{data.title}</BookTitle>
            <BookAuthor>{data.author}</BookAuthor>
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

        <div>
          <ThisReport>이 책의 독후감</ThisReport>

          <BookReport>
            <p>독후감 제목</p>
            <p>독후감 내용</p>
            <div>
              <hr />
              <p>작성자</p>
            </div>
          </BookReport>
        </div>
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

  margin-top: 0px;
  margin-bottom: 0px;
`;

const BookAuthor = styled.p`
  font-size: 20px;
  color: gray;
`;

const BookCover = styled.img`
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  margin-left: 30px;
`;

const BookIntroduction = styled.h1`
  border-bottom: 1px solid #e2e2e2;

  margin-bottom: 20px;
  margin-top: 50px;
`;

const BookIntroductionContent = styled.p`
  font-size: 20px;
  text-align: left;
`;

const ThisReport = styled.h1`
  border-bottom: 1px solid #e2e2e2;

  margin-bottom: 20px;
  margin-top: 50px;
`;
const BookReport = styled.div`
  border: 1px solid yellow;
  width: 200px;
  height: 200px;

  text-align: center;

  background-color: #ffdd3c;
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
