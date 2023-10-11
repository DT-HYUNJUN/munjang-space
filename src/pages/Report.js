import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import MyButton from "../components/MyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartFill } from "@fortawesome/free-solid-svg-icons";

const Report = ({ reportList, userInfo }) => {
  const [report, setReport] = useState({});
  const [like, setLike] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (reportList.length > 0) {
      const targetReport = reportList.find((it) => parseInt(it.id) === parseInt(id));
      if (targetReport) {
        setReport(targetReport);
      }
    }
  }, [reportList, id]);

  const handleClickEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleClickBook = (isbn13) => {
    navigate(`/book/${isbn13}`);
  };

  const handleClickLike = () => {
    setLike((prev) => !prev);
  };

  if (!report.book) {
    return <Container>loading</Container>;
  } else {
    return (
      <Container>
        <Header>
          <ReportTitle>{report.title}</ReportTitle>
          <SubTitle>
            <UserAndDate>
              <ProfileImage src={userInfo.photoURL} alt={report.author} />
              <span>{report.author}</span>
              <span>·</span>
              <span>{new Date(parseInt(report.date)).toLocaleDateString()}</span>
              {report.isPrivate ? null : <span>비공개</span>}
            </UserAndDate>
            <MyButton text={"수정하기"} type={"positive"} onClick={handleClickEdit} />
          </SubTitle>
          <BookWrapper style={{ position: "relative" }}>
            <BookBackground backgroundimage={report.book.cover} onClick={() => handleClickBook(report.book.isbn13)}></BookBackground>
            <BookInfo>
              <BookTitle>{report.book.title}</BookTitle>
              <BookDescription>{report.book.description}</BookDescription>
              <BookCover src={report.book.cover} alt={report.book.title} />
              <BookAuthor>{report.book.author}</BookAuthor>
            </BookInfo>
          </BookWrapper>
        </Header>
        <Content
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(report.content),
          }}
        ></Content>
        <Like onClick={handleClickLike}>
          <FontAwesomeIcon icon={like ? faHeartFill : faHeart} color="red" />
          {like ? report.like : "좋아요"}
        </Like>
        <Footer></Footer>
      </Container>
    );
  }
};

export default Report;

const Container = styled.div`
  margin-left: 240px;
  margin-right: 240px;
`;

const Header = styled.div`
  padding-top: 20px;
  padding-bottom: 40px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BookCover = styled.img`
  border: 1px solid #ccc;
  width: 150px;
`;
const Content = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  padding-right: 40px;
  padding-left: 40px;
  margin-bottom: 40px;

  border-top: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
`;
const Footer = styled.div``;

const BookWrapper = styled.div`
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid #ccc;
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
  opacity: 0.3;
  filter: blur(32px);
  z-index: 2;
  overflow: hidden;
`;

const BookInfo = styled.div`
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  /* backdrop-filter: blur(100px) brightness(150%); */
`;

const ReportTitle = styled.p`
  margin: 0;
  font-size: 40px;
  font-weight: bold;
  font-family: "KyoboHandwriting2021sjy";
`;

const UserAndDate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: gray;
  font-style: italic;
  display: flex;
  gap: 5px;
`;

const ProfileImage = styled.img`
  width: 25px;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: 50%;
`;

const BookDescription = styled.p`
  color: #6f6f6f;
  font-size: 12px;
`;

const BookTitle = styled.p`
  font-weight: bolder;
  font-size: 18px;
`;

const BookAuthor = styled.p`
  font-size: 12px;
`;

const SubTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Like = styled.div`
  display: flex;
  color: gray;
  margin-left: auto;
  margin-right: auto;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 60px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  gap: 5px;
  user-select: none;
`;
