import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import getBooks from "../utils/getBooks";
import MyButton from "../components/MyButton";

const Book = () => {
  const { isbn13 } = useParams();

  const [data, setData] = useState({});

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

  if (data) {
    return (
      <BookDetailEntire>
        <BookContent>
          <BookCover src={data.cover} alt="bookcover" />
          <div>
            <BookTitle>{data.title}</BookTitle>
            <BookAuthor>{data.author}</BookAuthor>
            <MyButton
              type={"positive"}
              text={"종이책 구매"}
              onClick={() => {
                window.location.href = data.link;
              }}
            />
          </div>
        </BookContent>

        <div>
          <h1>책소개</h1>
          <hr />
          <p>{data.description}</p>
        </div>

        <div>
          <h1>이 책의 독후감</h1>
          <hr />
          <div>
            <p>독후감제목</p>
            <p>유저이름</p>
          </div>
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
`;
