import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import styled from "styled-components";

import getBooks from "../utils/getBooks";
import MyButton from "../components/MyButton";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BookSearch = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [bookList, setBookList] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchComplete, setSearchComplete] = useState(false);

  const getBookList = async (bookName) => {
    try {
      setLoading(true);
      const books = await getBooks(bookName);
      setBookList(books);
    } catch (error) {
      console.log(error);
    } finally {
      setSearchComplete(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const bookName = state.bookName;
    getBookList(bookName);
  }, []);

  const handleClickCreate = (title, cover, author, description, isbn13) => {
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

  // book정보로 이동
  const handleClickBook = (isbn13) => {
    navigate(`/book/${isbn13}`);
  };

  return loading ? (
    <LoadingWrapper>
      <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    </LoadingWrapper>
  ) : searchComplete && bookList.length > 0 ? (
    <div>
      <SearchBoookName>검색한 '{state.bookName}' 입니다.</SearchBoookName>

      {bookList.map((book) => (
        <BookInfo
          key={book.isbn13}
          onClick={() => {
            handleClickBook(book.isbn13);
          }}
        >
          <img src={book.cover} alt={book.title} />
          <TitleAndAuthor>
            <BookTitle>{book.title}</BookTitle>
            <BookAuthor>{book.author}</BookAuthor>
          </TitleAndAuthor>

          <BookButton>
            <ReportWriteButton
              onClick={() =>
                handleClickCreate(
                  book.title,
                  book.cover,
                  book.author,
                  book.description,
                  book.isbn13
                )
              }
            >
              독후감작성
            </ReportWriteButton>
            <MyButton
              onClick={() => {
                handleClickBook(book.isbn13);
              }}
              type={"positive"}
              text={"책 정보"}
            />
          </BookButton>
        </BookInfo>
      ))}
    </div>
  ) : (
    <div>`{state.bookName}` 결과가 없습니다.</div>
  );
};

export default BookSearch;

const SearchBoookName = styled.h1`
  font-family: "UhBeeJJIBBABBA";
`;

const BookInfo = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-family: "KyoboHandwriting2021sjy";
  margin-bottom: 20px;

  cursor: pointer;
`;

const BookButton = styled.div``;

const ReportWriteButton = styled.button`
  border: 0;
  border-radius: 8px;

  cursor: pointer;
  background-color: #fffb85;

  width: 100px;
  height: 52px;

  font-family: "UhBeeJJIBBABBA";
  font-size: 14px;

  color: black;

  margin-left: 20px;
  margin-right: 10px;
  padding: 4px 4px;
  white-space: nowrap;
  &:hover {
    background-color: #f7f25e;
  }
`;

const BookTitle = styled.p`
  font-weight: bold;
  font-size: 32px;
  width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookAuthor = styled.p`
  color: gray;
  font-size: 24px;
  width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TitleAndAuthor = styled.div``;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
