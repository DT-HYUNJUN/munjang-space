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
      getLikeReports().then((res) =>
        setLikeReports(
          res.sort((a, b) => parseInt(b.like) - parseInt(a.like)).slice(0, 10)
        )
      );
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
    getLikeReports().then((res) =>
      setLikeReports(
        res.sort((a, b) => parseInt(b.like) - parseInt(a.like)).slice(0, 10)
      )
    );
  };

  const handleClickReport = (email, id) => {
    navigate(`/report/${email}/${id}`);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
  };

  return (
    <div>
      <Slider {...settings}>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </Slider>
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
        {likeReports.slice(0, 5).map((it, idx) => (
          <LikeReport key={idx}>
            <BookBackground
              backgroundimage={it.book.cover}
              onClick={() => handleClickReport(it.author, it.id)}
            ></BookBackground>
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
        {specialBook.map((item) => (
          <div key={item.isbn} onClick={() => clickBestSellerBook(item.isbn13)}>
            <Bookimg src={item.cover} alt={item.title} />
            <BookTitle>{truncateText(item.title, 10)}</BookTitle>
          </div>
        ))}
      </SpecilaBook>
    </div>
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
  margin-top: 50px;
`;

const BestLikesReport = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;

  margin-bottom: 30px;
  margin-top: 20px;
`;

const LikeReport = styled.div`
  font-family: "KyoboHandwriting2021sjy";
  position: relative;
  overflow: hidden;
  text-align: center;
  /* border: 1px solid #ccc; */
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
  width: 150px;
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
  width: 200px;
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
