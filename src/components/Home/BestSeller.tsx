import React, { useRef, useState } from "react";
import { IBook } from "../../types";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import useInterval from "../../utils/useInterval";
import { useNavigate } from "react-router-dom";

interface Props {
  bestsellerBooks: IBook[];
}

const BestSeller = (props: Props) => {
  // const [bestsellerBook, setBestSellerBook] = useState<IBook[]>([] as IBook[]);
  const [bookRank, setBookRank] = useState(1);
  const [isPlay, setIsPlay] = useState(true);
  const intervalValue = useRef<number | null>(3000);
  const navigate = useNavigate();

  // const [bsLoading, setBsLoading] = useState(false);

  const handleClickPageOne = () => {
    setBookRank(1);
  };

  const handleClickPageTwo = () => {
    setBookRank(6);
  };

  const handleClickPause = () => {
    setIsPlay((prev) => !prev);
    isPlay ? (intervalValue.current = null) : (intervalValue.current = 3000);
  };

  const startIndex = () => {
    if (bookRank < 6) {
      return 0;
    } else {
      return 5;
    }
  };

  const endIndex = () => {
    if (bookRank < 6) {
      return 5;
    } else {
      return 10;
    }
  };

  useInterval(() => {
    if (bookRank === 10) {
      setBookRank(1);
    } else {
      setBookRank((bookRank) => bookRank + 1);
    }
  }, intervalValue.current as number);

  const clickBestSellerBook = (isbn13: string) => {
    navigate(`/book/${isbn13}`);
  };

  const handleSelectBook = (index: number) => {
    setBookRank(index);
  };

  return (
    <div>
      <TitleWrapper>
        <EmptyTag></EmptyTag>
        <BestSellerBigTitle>베스트셀러</BestSellerBigTitle>
        <PageWrapper>
          <PauseButton>{isPlay ? <FontAwesomeIcon icon={faPause} color="#777" onClick={handleClickPause} /> : <FontAwesomeIcon icon={faPlay} color="#777" onClick={handleClickPause} />}</PauseButton>
          {bookRank < 6 ? (
            <>
              <SelectedPageItem onClick={handleClickPageOne}>1</SelectedPageItem>
              <PageItem onClick={handleClickPageTwo}>2</PageItem>
            </>
          ) : (
            <>
              <PageItem onClick={handleClickPageOne}>1</PageItem>
              <SelectedPageItem onClick={handleClickPageTwo}>2</SelectedPageItem>
            </>
          )}
        </PageWrapper>
      </TitleWrapper>

      <BestSellerWrapper>
        <BestBookInfoWrapper onClick={() => clickBestSellerBook(props.bestsellerBooks[bookRank - 1]?.isbn13)}>
          <BestBookCover key={bookRank} src={props.bestsellerBooks[bookRank - 1]?.cover} alt={props.bestsellerBooks[bookRank - 1]?.title} />
          <BestBookInfo>
            <SelectedBestBookTitle>{props.bestsellerBooks[bookRank - 1]?.title}</SelectedBestBookTitle>
            <SelectedBestBookAuthor>{props.bestsellerBooks[bookRank - 1]?.author}</SelectedBestBookAuthor>
          </BestBookInfo>
        </BestBookInfoWrapper>
        <BestBookList>
          {props.bestsellerBooks.slice(startIndex(), endIndex()).map((item) =>
            bookRank === item.bestRank ? (
              <SelectedBookItem key={item.isbn13} onClick={() => handleSelectBook(item.bestRank!)}>
                <SelectedBestBookIndex>{item.bestRank}</SelectedBestBookIndex>
                <SelectedBestBookTitleItem>{item.title}</SelectedBestBookTitleItem>
              </SelectedBookItem>
            ) : (
              <BookItem key={item.isbn13} onClick={() => handleSelectBook(item.bestRank!)}>
                <BestBookIndex>{item.bestRank}</BestBookIndex>
                <BestBookTitle>{item.title}</BestBookTitle>
              </BookItem>
            )
          )}
        </BestBookList>
      </BestSellerWrapper>
    </div>
  );
};

export default BestSeller;

const fillUp = keyframes`
  0% {
  opacity: 0;
  transform: translate3d(0, -10%, 0);
  }
  100% {
  opacity: 1;
  transform: translateZ(0);
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 50px 100px 0px 100px;

  @media (max-width: 768px) {
    margin: 50px 0 0 0;
  }
`;

const EmptyTag = styled.div`
  display: flex;
  width: 25%;
  justify-content: start;
`;

const BestSellerBigTitle = styled.h1`
  display: flex;
  justify-content: center;
  width: 50%;
  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
  gap: 5px;
  justify-content: end;
`;

const PauseButton = styled.div`
  cursor: pointer;
  margin-right: 10px;
`;

const SelectedPageItem = styled.button`
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  background-color: black;
`;

const PageItem = styled.button`
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  color: #777;
  background: none;
`;

const BestBookInfoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0px;
  }
`;
const BestBookCover = styled.img`
  border: 1px solid #ccc;
  width: 140px;
  height: 200px;
  animation: ${fillUp} ease-in-out 0.3s forwards;
`;
const BestBookInfo = styled.div`
  font-family: "KyoboHandwriting2021sjy";
  width: 200px;
`;

const SelectedBestBookTitle = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 24px;
  font-weight: bold;
`;
const SelectedBestBookAuthor = styled.p`
  font-size: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;

  @media (max-width: 768px) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;
const BestBookList = styled.div`
  cursor: pointer;
  width: 400px;
  font-family: "KyoboHandwriting2021sjy";
  @media (max-width: 768px) {
    width: 300px;
  }
`;
const SelectedBookItem = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 5px;
`;

const SelectedBestBookIndex = styled.span`
  font-size: 28px;
  font-weight: bold;
`;
const SelectedBestBookTitleItem = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
`;
const BookItem = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border: 1px solid white;
  border-radius: 5px;
`;

const BestBookIndex = styled.span`
  font-size: 28px;
  color: #777;
`;
const BestBookTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #777;
`;

const BestSellerWrapper = styled.div`
  border-top: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;

  margin: 10px 100px 30px 100px;

  @media (max-width: 768px) {
    margin: 10px 0 30px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  padding: 40px 0;
`;
