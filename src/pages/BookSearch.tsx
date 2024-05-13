import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import getBooks from "../utils/getBooks";
import MyButton from "../components/Global/MyButton";
import { IBook } from "../types";
import Loading from "../components/Global/Loading";

interface HandleClickCreate {
  (title: string, cover: string, author: string, description: string, isbn13: string): void;
}

const BookSearch = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [bookList, setBookList] = useState<IBook[]>([]);

  const [loading, setLoading] = useState(false);

  const [searchComplete, setSearchComplete] = useState(false);

  const getBookList = async (bookName: string) => {
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

  const handleClickCreate: HandleClickCreate = (title, cover, author, description, isbn13) => {
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
  const handleClickBook = (isbn13: string) => {
    navigate(`/book/${isbn13}`);
  };

  return loading ? (
    <Loading />
  ) : searchComplete && bookList.length > 0 ? (
    <Container>
      <SearchBoookName>검색한 '{state.bookName}' 입니다.</SearchBoookName>
      <BookList>
        {bookList.map((book) => (
          <BookInfo key={book.isbn13}>
            <BookDetail
              onClick={() => {
                handleClickBook(book.isbn13);
              }}
            >
              <BookCover src={book.cover} alt={book.title} />
              <TitleAndAuthor>
                <BookTitle>{book.title}</BookTitle>
                <BookAuthor>{book.author}</BookAuthor>
              </TitleAndAuthor>
            </BookDetail>

            <BookButton>
              <ReportWriteButton onClick={() => handleClickCreate(book.title, book.cover, book.author, book.description, book.isbn13)}>독후감작성</ReportWriteButton>
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
      </BookList>
    </Container>
  ) : (
    <div>`{state.bookName}` 결과가 없습니다.</div>
  );
};

export default BookSearch;

const SearchBoookName = styled.h1`
  font-family: "UhBeeJJIBBABBA";

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const BookInfo = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-family: "KyoboHandwriting2021sjy";
  margin-bottom: 20px;

  cursor: pointer;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    margin-bottom: 50px;
  }
`;

const BookButton = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const ReportWriteButton = styled.button`
  border: 0;
  border-radius: 8px;

  cursor: pointer;
  background-color: #fffb85;

  width: 100px;
  height: 40px;

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 16px;
    width: 100%;
  }
`;

const BookAuthor = styled.p`
  color: gray;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TitleAndAuthor = styled.div`
  width: 500px;

  @media (max-width: 768px) {
    width: 200px;
    text-align: center;
  }
`;

const BookDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0px;
  }
`;

const BookCover = styled.img`
  @media (max-width: 768px) {
    width: 60px;
  }
`;

const Container = styled.div`
  @media (max-width: 768px) {
    margin: 10;
  }
`;

const BookList = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
`;
