import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import listBooks from "../utils/listBooks";
import newSpecialBook from "../utils/newSpecialBook";
import getLikeReports from "../utils/getLikeReports";

import styled from "styled-components";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [bestsellerBook, setBestSellerBook] = useState([]);

  const [specialBook, setSpecialBook] = useState([]);

  const [likeReports, setLikeReports] = useState([]);

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

  return (
    <>
      <BigTitle>베스트셀러</BigTitle>
      <BestSeller>
        {bestsellerBook.map((item) => (
          <div key={item.isbn} onClick={() => clickBestSellerBook(item.isbn13)}>
            <Bookimg src={item.cover} alt={item.title} />
            <BookTitle>{truncateText(item.title, 10)}</BookTitle>
          </div>
        ))}
      </BestSeller>

      <BigTitle>
        지금 인기있는 독후감은?{" "}
        <RefreshButton onClick={handleClickLikeReports}>
          <FontAwesomeIcon icon={faRefresh} />
        </RefreshButton>
      </BigTitle>
      <BestLikesReport>
        {likeReports.map((it, idx) => (
          <LikeReport key={idx} onClick={() => handleClickReport(it.author, it.id)}>
            <p>{it.title}</p>
            <p>{it.like}</p>
            <p>{it.content.replace(/(<([^>]+)>)/gi, "")}</p>
          </LikeReport>
        ))}
      </BestLikesReport>

      <BigTitle>이런책은 어떠세요? </BigTitle>
      <BigTitle>주목할만한 신간리스트 입니다.</BigTitle>
      <SpecilaBook>
        {specialBook.map((item) => (
          <div key={item.isbn} onClick={() => clickBestSellerBook(item.isbn13)}>
            <Bookimg src={item.cover} alt={item.title} />
            <BookTitle>{truncateText(item.title, 10)}</BookTitle>
          </div>
        ))}
      </SpecilaBook>
    </>
  );
};

export default Home;

const BestSeller = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  margin-bottom: 30px;
  margin-top: 20px;
`;

const SpecilaBook = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  margin-bottom: 30px;
  margin-top: 20px;
`;

const Bookimg = styled.img`
  width: 100px;
  height: 150px;
  /* margin-right: 20px; */
`;

const BookTitle = styled.p`
  text-align: center;
  font-family: "KyoboHandwriting2021sjy";
  font-size: 18px;
`;

const BigTitle = styled.h1`
  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  margin-bottom: 0px;
  margin-top: 0px;
`;

const BestLikesReport = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;

  margin-bottom: 30px;
  margin-top: 20px;
`;

const LikeReport = styled.div`
  border: 1px solid #ccc;
  cursor: pointer;
`;

const RefreshButton = styled.span`
  font-family: "";
  font-size: 16px;
  color: gray;
  cursor: pointer;
`;
