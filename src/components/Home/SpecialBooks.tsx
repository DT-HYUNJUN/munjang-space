import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "../../slick.css";
import "../../slick-theme.css";
import styled from "styled-components";
import { IBook } from "../../types";

const newSpecialBookSettings = {
  dots: true,
  infinite: true,
  slidesToShow: 5,
  slidesToScroll: 5,
  autoplay: true,
  autoplaySpeed: 7000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
      },
    },
  ],
};

interface Props {
  specialBooks: IBook[];
}

const SpecialBooks = (props: Props) => {
  const navigate = useNavigate();

  const clickBestSellerBook = (isbn13: string) => {
    navigate(`/book/${isbn13}`);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div>
      <BigTitle>이런책은 어떠세요? </BigTitle>
      <BigTitle>주목할만한 신간리스트 입니다.</BigTitle>

      <SpecilaBook>
        <Slider {...newSpecialBookSettings}>
          {props.specialBooks.map((item) => (
            <BookWrapper key={item.isbn13} onClick={() => clickBestSellerBook(item.isbn13)}>
              <Bookimg src={item.cover} alt={item.title} />
              <BookTitle>{truncateText(item.title, 10)}</BookTitle>
            </BookWrapper>
          ))}
        </Slider>
      </SpecilaBook>
    </div>
  );
};

export default SpecialBooks;

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

const BigTitle = styled.h1`
  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const BookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
