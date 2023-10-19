import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import listBooks from "../utils/listBooks";
import newSpecialBook from "../utils/newSpecialBook";

import styled from "styled-components";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [bestsellerBook, setBestSellerBook] = useState([]);

  const [specialBook, setSpecialBook] = useState([]);

  useEffect(() => {
    try {
      listBooks().then((res) => setBestSellerBook(res));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      newSpecialBook().then((res) => setSpecialBook(res));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const navigate = useNavigate();

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

      {/* <BigTitle>지금 인기있는 독후감은? </BigTitle> */}

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
  justify-content: center;
  cursor: pointer;

  margin-bottom: 30px;
  margin-top: 20px;
`;

const SpecilaBook = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;

  margin-bottom: 30px;
  margin-top: 20px;
`;

const Bookimg = styled.img`
  width: 100px;
  height: 150px;
  margin-right: 20px;
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
