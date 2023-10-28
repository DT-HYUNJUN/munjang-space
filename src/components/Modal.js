import { useEffect, useRef, useState } from "react";

import Pagination from "react-js-pagination";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faSearch, faSpinner, faX } from "@fortawesome/free-solid-svg-icons";

import getBooks from "../utils/getBooks";
import styled from "styled-components";

const Modal = ({ setModal, setBook, reportList }) => {
  const [loading, setLoading] = useState(false);

  const [bookData, setBookData] = useState([]); // api로 받아온 책 리스트

  const [inputTitle, setInputTitle] = useState(""); // 검색할 책

  const [searchComplete, setSearchComplete] = useState(false);

  const checkRef = useRef();

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (page) => setPage(page);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = bookData.slice(startIndex, endIndex);

  const closeModal = () => {
    setModal(false);
  };

  // 검색창에 적는 거
  const handleInput = () => {
    const inputSave = document.getElementById("searchTitle").value;
    setInputTitle(inputSave);
  };

  // 검색창 엔터 눌렀을 때
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    try {
      setLoading(true);
      const books = await getBooks(inputTitle);
      setBookData(books);
      setSearchComplete(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 검색한 책 클릭 이벤트
  const handleClickBook = (title, cover, description, author, isbn13, check) => {
    if (check) {
      if (window.confirm("이미 독후감을 작성한 책입니다. 그래도 선택하시겠습니까?")) {
        setBook({
          title,
          cover,
          description,
          author,
          isbn13,
        });
        setModal(false);
      }
    } else {
      setBook({
        title,
        cover,
        description,
        author,
        isbn13,
      });
      setModal(false);
    }
  };

  return (
    <Container>
      <CloseButton onClick={closeModal}>
        <FontAwesomeIcon icon={faX} size="xl" />
      </CloseButton>
      <FormWrapper onSubmit={handleSubmit}>
        <TitleInput type="text" id="searchTitle" onChange={handleInput} placeholder="책 이름 검색" required />
        <TitleInputButton type="submit">
          <FontAwesomeIcon icon={faSearch} size="xl" />
        </TitleInputButton>
      </FormWrapper>

      <Content>
        {loading ? (
          <LoadingWrapper>
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          </LoadingWrapper>
        ) : (
          <div>
            <BookEntire>
              {searchComplete && bookData.length === 0 ? (
                <NoData>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <p>{`'${inputTitle}' 결과가 없습니다`}</p>
                </NoData>
              ) : (
                currentPageData.map((it) => (
                  <BookContainer key={it.isbn}>
                    <BookList
                      onClick={() =>
                        handleClickBook(
                          it.title,
                          it.cover,
                          it.description,
                          it.author,
                          it.isbn13,
                          reportList?.find((report) => report.book.isbn13 === it.isbn13)
                        )
                      }
                    >
                      <BookCover src={it.cover} alt={it.title} />
                      <BookDetail>
                        <BookTitleWrapper>
                          <BookTitle>{it.title}</BookTitle>
                          {reportList?.find((report) => report.book.isbn13 === it.isbn13) && <FontAwesomeIcon ref={checkRef} icon={faCheckCircle} color="#337ab7" />}
                        </BookTitleWrapper>
                        <BookAuthor>{it.author}</BookAuthor>
                      </BookDetail>
                    </BookList>
                  </BookContainer>
                ))
              )}
            </BookEntire>
            {currentPageData.length !== 0 && (
              <Pagination activePage={page} itemsCountPerPage={5} totalItemsCount={bookData.length} pageRangeDisplayed={5} prevPageText={"<"} nextPageText={">"} onChange={handlePageChange} />
            )}
          </div>
        )}
      </Content>
    </Container>
  );
};

export default Modal;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1000px;
  height: 820px;
  padding: 20px;
  z-index: 999;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: 8px;

  background-color: #ececec;
  /* box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.35); */
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
`;

const CloseButton = styled.button`
  position: absolute;
  border: 0;
  background: transparent;
  cursor: pointer;
  right: 10px;
  top: 10px;
`;

const FormWrapper = styled.form`
  display: flex;
  align-items: center;
  position: relative;
  background-color: white;
  border-radius: 8px;
`;

const TitleInput = styled.input`
  padding-left: 10px;
  font-family: "KyoboHandwriting2021sjy";
  font-size: 20px;
  border: 0;
  width: 500px;
  height: 50px;
  background: transparent;
  &:focus {
    outline: none;
  }
`;

const TitleInputButton = styled.button`
  cursor: pointer;
  border: 0;
  background: transparent;
`;

const Content = styled.div`
  position: relative;
  padding: 10px;
  width: 100%;
  height: 100%;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const BookList = styled.div`
  display: flex;
  margin-left: 10px;
  padding: 5px;
`;

const BookDetail = styled.div`
  margin-left: 50px;
  font-family: "KyoboHandwriting2021sjy";
  font-size: 20px;
  flex-grow: 1;
`;

const BookTitle = styled.p`
  font-weight: bold;
  font-size: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 800px;
`;

const BookAuthor = styled.span`
  color: gray;
`;

const BookEntire = styled.div`
  margin-left: 10px;
  margin-bottom: 10px;
  background-color: white;
  border: 1px solid white;
`;

const NoData = styled.div`
  font-family: "KyoboHandwriting2021sjy";
  text-align: center;
  font-size: 36px;
  padding: 50px;
`;

const BookContainer = styled.div`
  background-color: white;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    filter: brightness(90%);
  }
`;

const BookCover = styled.img`
  width: 85px;
`;

const BookTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
