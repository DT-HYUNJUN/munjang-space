import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const Report = ({ reportList }) => {
  const [report, setReport] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (reportList.length > 0) {
      const targetReport = reportList.find((it) => parseInt(it.id) === parseInt(id));
      if (targetReport) {
        setReport(targetReport);
      }
    }
  }, [reportList, id]);

  if (!report.book) {
    return <Container>loading</Container>;
  } else {
    return (
      <Container>
        <Header>
          <ReportTitle>{report.title}</ReportTitle>
          <UserAndDate>
            <ProfileImage src="" alt={report.author} />
            <span>{report.author}</span>
            <span>·</span>
            <span>{new Date(parseInt(report.date)).toLocaleDateString()}</span>
            {report.isPrivate ? null : <span>비공개</span>}
          </UserAndDate>
          <BookBackground backgroundImage={report.book.cover}>
            <BookWrapper>
              <BookDescription>{report.book.description}</BookDescription>
              <BookCover src={report.book.cover} alt={report.book.title} />
              <BookTitle>{report.book.title}</BookTitle>
              <BookAuthor>{report.book.author}</BookAuthor>
            </BookWrapper>
          </BookBackground>
        </Header>
        <hr />
        <Content
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(report.content),
          }}
        ></Content>
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
  padding-bottom: 20px;
  /* padding-left: 40px;
  padding-right: 40px; */
  /* margin-bottom: 40px; */

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BookCover = styled.img`
  border: 1px solid #ccc;
  width: 150px;
`;
const Content = styled.div`
  /* border: 1px solid #ccc; */
  /* border-radius: 15px; */
  padding-top: 20px;
  padding-right: 40px;
  padding-left: 40px;
`;
const Footer = styled.div``;

const BookBackground = styled.div`
  border-radius: 30px;
  border: 0;
  background-image: url(${(props) => props.backgroundImage});
  /* opacity: 0.15; */
  /* background-size: cover;
  background-position: center center; */
`;

const ReportTitle = styled.p`
  margin: 0;
  font-size: 40px;
  font-weight: bold;
  font-family: "KyoboHandwriting2021sjy";
`;

const UserAndDate = styled.div`
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
  font-weight: bold;
`;

const BookAuthor = styled.p`
  font-size: 12px;
`;

const BookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-radius: 30px;
  backdrop-filter: blur(100px) brightness(150%);
`;
