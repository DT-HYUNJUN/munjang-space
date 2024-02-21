import { useRef, useState } from "react";

import Pagination from "react-js-pagination";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faSearch, faSpinner, faX } from "@fortawesome/free-solid-svg-icons";

import getBooks from "../utils/getBooks";
import styled, { keyframes } from "styled-components";
import { IBook, IReport } from "../types";

interface Props {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setBook: React.Dispatch<React.SetStateAction<IBook>>;
  reportList: IReport[];
}

type HandleClickBook = {
  (title: string, cover: string, description: string, author: string, isbn13: string, check: IReport): void;
};

const Modal = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const [bookData, setBookData] = useState<IBook[]>([]); // api로 받아온 책 리스트

  const [inputTitle, setInputTitle] = useState(""); // 검색할 책

  const [searchComplete, setSearchComplete] = useState(false);

  const checkRef = useRef<SVGSVGElement>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (page: number) => setPage(page);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = bookData.slice(startIndex, endIndex);

  const closeModal = () => {
    props.setModal(false);
  };

  // 검색창에 적는 거
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const inputSave = document.getElementById("searchTitle").value;
    setInputTitle(e.target.value);
  };

  // 검색창 엔터 눌렀을 때
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
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
  const handleClickBook: HandleClickBook = (title, cover, description, author, isbn13, check) => {
    if (check) {
      if (window.confirm("이미 독후감을 작성한 책입니다. 그래도 선택하시겠습니까?")) {
        props.setBook({
          title,
          cover,
          description,
          author,
          isbn13,
        });
        props.setModal(false);
      }
    } else {
      props.setBook({
        title,
        cover,
        description,
        author,
        isbn13,
      });
      props.setModal(false);
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
                  <BookContainer key={it.isbn13}>
                    <BookList
                      onClick={() =>
                        handleClickBook(it.title, it.cover, it.description, it.author, it.isbn13, props.reportList && (props.reportList.find((report) => report.book.isbn13 === it.isbn13) as IReport))
                      }
                    >
                      <BookCover src={it.cover} alt={it.title} />
                      <BookDetail>
                        <BookTitleWrapper>
                          <BookTitle>{it.title}</BookTitle>
                          {props.reportList?.find((report) => report.book.isbn13 === it.isbn13) && <FontAwesomeIcon ref={checkRef} icon={faCheckCircle} color="#337ab7" />}
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

const fadein = keyframes`
  from {
  opacity:0;
  }
  to {
  opacity:1;
  }
`;

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
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

  animation: ${fadein} 0.3s;

  @media (max-width: 768px) {
    width: 80%;
    height: 700px;
  }
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

  @media (max-width: 768px) {
    margin-top: 20px;
    width: 100%;
  }
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

  @media (max-width: 768px) {
    width: 100%;
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

  @media (max-width: 768px) {
    height: 600px;
  }
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

  @media (max-width: 768px) {
    margin: 0;
  }
`;

const BookDetail = styled.div`
  margin-left: 50px;
  font-family: "KyoboHandwriting2021sjy";
  font-size: 20px;
  flex-grow: 1;
  @media (max-width: 768px) {
    margin-left: 10px;
    width: 100%;
  }
`;

const BookTitle = styled.p`
  font-weight: bold;
  font-size: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 800px;

  @media (max-width: 768px) {
    font-size: 16px;
    width: 150px;
  }
`;

const BookAuthor = styled.span`
  color: gray;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BookEntire = styled.div`
  margin-left: 10px;
  margin-bottom: 10px;
  background-color: white;
  border: 1px solid white;

  @media (max-width: 768px) {
    margin-left: 0;
  }
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

  @media (max-width: 768px) {
    width: 85px;
    height: 100px;
  }
`;

const BookTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
