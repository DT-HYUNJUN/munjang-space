import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import listBooks from "../utils/listBooks";
import newSpecialBook from "../utils/newSpecialBook";
import getLikeReports from "../utils/getLikeReports";

import MyButton from "../components/MyButton";

import styled, { keyframes } from "styled-components";

import Slider from "react-slick";
import "../slick.css";
import "../slick-theme.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faPenFancy, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import useInterval from "../utils/useInterval";

const Home = () => {
  const [bestsellerBook, setBestSellerBook] = useState([]);

  const [specialBook, setSpecialBook] = useState([]);

  const [likeReports, setLikeReports] = useState([]);

  const [bookRank, setBookRank] = useState(1);

  const [isPlay, setIsPlay] = useState(true);

  const [bookName, setBookName] = useState("");

  const intervalValue = useRef(3000);

  // placeholder
  const [inputClick, setInputClick] = useState("false");

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

  const navigate = useNavigate();

  useEffect(() => {
    try {
      getLikeReports().then((res) => setLikeReports(res.sort((a, b) => parseInt(b.like) - parseInt(a.like)).slice(0, 10)));
      listBooks().then((res) => setBestSellerBook(res));
      newSpecialBook().then((res) => setSpecialBook(res));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useInterval(() => {
    if (bookRank === 10) {
      setBookRank(1);
    } else {
      setBookRank((bookRank) => bookRank + 1);
    }
  }, intervalValue.current);

  const clickBestSellerBook = (isbn13) => {
    navigate(`/book/${isbn13}`);
  };

  // 책 제목 길이 제한
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  }

  const handleClickLikeReports = () => {
    getLikeReports().then((res) => setLikeReports(res.sort((a, b) => parseInt(b.like) - parseInt(a.like)).slice(0, 10)));
  };

  const handleClickReport = (email, id) => {
    navigate(`/report/${email}/${id}`);
  };

  const handleClickNew = () => {
    navigate("/new");
  };

  const handleSelectBook = (index) => {
    setBookRank(index);
  };

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

  const handleInput = (e) => {
    setBookName(e.target.value);
  };

  const newSpecialBookSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
  };

  return (
    <>
      <BookSearchWrapper>
        <BookSearchForm
          onSubmit={() =>
            navigate("/booksearch", {
              state: {
                bookName,
              },
            })
          }
        >
          <BookSearchInput
            type="text"
            value={bookName}
            onChange={handleInput}
            required
            onFocus={() => {
              setInputClick(true);
            }}
            onBlur={() => setInputClick(false)}
            placeholder={inputClick === true ? "" : "책 제목을 입력해주세요."}
          />
          <MyButton type={"positive"} text={"책 검색"} />
        </BookSearchForm>
      </BookSearchWrapper>

      <NewButtonWrapper>
        <CreateButton onClick={handleClickNew}>
          <FontAwesomeIcon icon={faPenFancy} /> 독후감 작성하기
        </CreateButton>
      </NewButtonWrapper>

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
      <BestSeller>
        <BestBookInfoWrapper onClick={() => clickBestSellerBook(bestsellerBook[bookRank - 1]?.isbn13)}>
          <BestBookCover key={bookRank} src={bestsellerBook[bookRank - 1]?.cover} alt={bestsellerBook[bookRank - 1]?.title} />
          <BestBookInfo>
            <SelectedBestBookTitle>{bestsellerBook[bookRank - 1]?.title}</SelectedBestBookTitle>
            <SelectedBestBookAuthor>{bestsellerBook[bookRank - 1]?.author}</SelectedBestBookAuthor>
          </BestBookInfo>
        </BestBookInfoWrapper>
        <BestBookList>
          {bestsellerBook.slice(startIndex(), endIndex()).map((item) =>
            bookRank === item.bestRank ? (
              <SelectedBookItem key={item.isbn13} onClick={() => handleSelectBook(item.bestRank)}>
                <SelectedBestBookIndex>{item.bestRank}</SelectedBestBookIndex>
                <SelectedBestBookTitleItem>{item.title}</SelectedBestBookTitleItem>
              </SelectedBookItem>
            ) : (
              <BookItem key={item.isbn13} onClick={() => handleSelectBook(item.bestRank)}>
                <BestBookIndex>{item.bestRank}</BestBookIndex>
                <BestBookTitle>{item.title}</BestBookTitle>
              </BookItem>
            )
          )}
        </BestBookList>
      </BestSeller>

      <BigTitleLike>
        지금 인기있는 독후감은?{" "}
        <RefreshButton onClick={handleClickLikeReports}>
          <FontAwesomeIcon icon={faRefresh} />
        </RefreshButton>
      </BigTitleLike>
      <BestLikesReport>
        {likeReports.slice(0, 5).map((it, idx) => (
          <LikeReport key={idx}>
            <BookBackground backgroundimage={it.book.cover} onClick={() => handleClickReport(it.author, it.id)}></BookBackground>
            <ReportRank>BEST {idx + 1}</ReportRank>
            <BookCover src={it.book.cover} alt={it.book.title} />
            <ReportTitle>{it.title}</ReportTitle>
            <ReportProfile>
              <ReportAuthorImage src={it.profileImage} alt={it.author} />
              <ReportAuthor>{it.username}</ReportAuthor>
            </ReportProfile>
          </LikeReport>
        ))}
      </BestLikesReport>

      <BigTitle>이런책은 어떠세요? </BigTitle>
      <BigTitle>주목할만한 신간리스트 입니다.</BigTitle>
      <SpecilaBook>
        <Slider {...newSpecialBookSettings}>
          {specialBook.map((item) => (
            <BookWrapper key={item.isbn} onClick={() => clickBestSellerBook(item.isbn13)}>
              <Bookimg src={item.cover} alt={item.title} />
              <BookTitle>{truncateText(item.title, 10)}</BookTitle>
            </BookWrapper>
          ))}
        </Slider>
      </SpecilaBook>
    </>
  );
};

export default Home;

const BestSeller = styled.div`
  border-top: 1px solid #d8d8d8;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;

  margin: 10px 100px 30px 100px;

  padding: 40px 0;
`;

const SpecilaBook = styled.div`
  cursor: pointer;

  margin-bottom: 60px;
  margin-top: 20px;
`;

const Bookimg = styled.img`
  width: 100px;
  height: 150px;
`;

const BookTitle = styled.p`
  font-family: "KyoboHandwriting2021sjy";
  font-size: 18px;
`;

const BestSellerBigTitle = styled.h1`
  display: flex;
  justify-content: center;
  width: 50%;
  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  margin: 0;
`;

const BigTitle = styled.h1`
  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  margin: 0;
`;

const BigTitleLike = styled.h1`
  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  margin-bottom: 0px;
  margin-top: 70px;
`;

const BestLikesReport = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 50px;

  margin-bottom: 70px;
  margin-top: 20px;
`;

const LikeReport = styled.div`
  text-align: center;
  font-family: "KyoboHandwriting2021sjy";
  position: relative;
  overflow: hidden;
  text-align: center;
  box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.06), 2px 2px 10px rgba(0, 0, 0, 0.04);
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
`;

const RefreshButton = styled.span`
  font-family: "";
  font-size: 16px;
  color: gray;
  cursor: pointer;
`;

const BookCover = styled.img`
  width: 140px;
  height: 200px;
  border: 0.5px solid #ccc;
`;

const ReportRank = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const ReportProfile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const ReportAuthorImage = styled.img`
  border: 1px solid #ccc;
  border-radius: 75px;
  width: 25px;
  height: 25px;
`;

const ReportAuthor = styled.div`
  font-size: 18px;
`;

const ReportTitle = styled.div`
  padding-left: 5px;

  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
`;

const BookBackground = styled.div`
  cursor: pointer;
  position: absolute;

  border-radius: 30px;

  overflow: hidden;

  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;

  background-image: url(${(props) => props.backgroundimage});
  background-size: cover;
  background-position: center center;

  width: 100%;
  height: 100%;

  opacity: 0.2;

  filter: blur(32px);

  z-index: 2;
  overflow: hidden;
`;

const BookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NewButtonWrapper = styled.div``;

const SelectedBookItem = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 5px;
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

const BestBookTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #777;
`;

const SelectedBestBookIndex = styled.span`
  font-size: 28px;
  font-weight: bold;
`;

const BestBookIndex = styled.span`
  font-size: 28px;
  color: #777;
`;

const BestBookList = styled.div`
  cursor: pointer;
  width: 400px;
  font-family: "KyoboHandwriting2021sjy";
`;

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

const BestBookInfoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  gap: 15px;
  align-items: center;
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
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 50px 100px 0px 100px;
`;

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
  gap: 5px;
  justify-content: end;
`;

const EmptyTag = styled.div`
  display: flex;
  width: 25%;
  justify-content: start;
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

const PauseButton = styled.div`
  cursor: pointer;
  margin-right: 10px;
`;

const CreateButton = styled.div`
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: 0.5s;
  opacity: 0.85;
  z-index: 10;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  background-color: #a7d7e8;
  color: white;
  white-space: nowrap;
  font-family: "UhBeeJJIBBABBA";
  font-size: 18px;
  padding: 10px 15px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  &:hover {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.2, 1.2);
    transition: 0.5s;
    background-color: #79cbe9;
    color: white;
    opacity: 1;
  }
`;

const SelectedBestBookTitleItem = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
`;

const BookSearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
`;

const BookSearchInput = styled.input`
  border: 1px solid #777;
  font-size: 24px;
  border-radius: 8px;
  width: 500px;

  font-family: "UhBeeJJIBBABBA";
`;

const BookSearchForm = styled.form`
  display: flex;
  align-self: center;
  gap: 10px;
`;
