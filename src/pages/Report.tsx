import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styled from "styled-components";

import MyButton from "../components/Global/MyButton";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { faBookOpen, faHeart as faHeartFill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

import DOMPurify from "dompurify";
import { IReport, IUserInfo } from "../types";

interface BookBackgroundProps {
  backgroundimage: string;
}

interface Props {
  reportList: IReport[];
  onLike: (author: string, id: string) => Promise<number>;
  onDelete: (id: string) => void;
  userInfo: IUserInfo;
}

const Report = (props: Props) => {
  const [report, setReport] = useState<IReport>({} as IReport);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const auth = getAuth();

  const navigate = useNavigate();

  const { email, id } = useParams() as { email: string; id: string };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && email === user.email) {
        setUserEmail(user.email);
        if (props.reportList.length > 0) {
          const targetReport = props.reportList.find((it) => parseInt(it.id) === parseInt(id));
          if (targetReport) {
            setReport(targetReport);
            loadLike(targetReport.author, user.email);
            setLikeCount(targetReport.like);
          }
        }
      } else {
        getReport();
        if (user) {
          loadLike(email, user.email!);
        }
      }
    });
  }, [email, id, props.reportList]);

  const getReport = async () => {
    try {
      const targetReportRef = doc(db, "reports", email, "books", id);
      const targetReport = await getDoc(targetReportRef);
      setReport(targetReport.data() as IReport);
      setLikeCount(targetReport.data()!.like);
    } catch (error) {
      console.log("getReport Error");
    }
  };

  const handleClickEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleClickBook = (isbn13: string) => {
    navigate(`/book/${isbn13}`);
  };

  const handleClickLike = (author: string, id: string) => {
    props.onLike(author, id).then((res) => setLikeCount(res));
    setLike((prev) => !prev);
  };

  const handleClickDelete = (id: string) => {
    if (window.confirm("독후감을 삭제 하시겠습니까?")) {
      props.onDelete(id);
      window.alert("삭제되었습니다.");
      navigate("/list", { replace: true });
    } else {
      window.alert("취소 되었습니다.");
    }
  };

  const replaceString = (string: string, from: number, to: number) => {
    return string.substring(0, from) + "*".repeat(to - from + 1) + string.substring(to + 1, string.length);
  };

  const emailPrivacy = (email: string) => {
    const splitString = email.split("@");
    const targetString = splitString[0];
    const etcString = splitString[1];
    const starNum = Math.floor(targetString.length / 2);
    return replaceString(targetString, starNum, targetString.length - 1) + "@" + etcString;
  };

  const loadLike = async (reportAuthor: string, email: string) => {
    const isLikeRef = doc(db, "reports", reportAuthor, "books", id, "likeList", email);
    const isLikeDoc = await getDoc(isLikeRef);
    if (isLikeDoc.data()) {
      const isLike = isLikeDoc.data()!.isLike;
      isLike ? setLike(true) : setLike(false);
    }
  };

  if (report && report.book) {
    return (
      <Container>
        <Header>
          <ReportTitle>{report.title}</ReportTitle>
          <SubTitle>
            <UserAndDate>
              <ProfileImage src={report.profileImage} alt={report.author} />
              <Author>
                <span>{report.username}</span>
                <span>({emailPrivacy(report.author)})</span>
              </Author>
              <span>{new Date(report.date).toLocaleDateString()}</span>
              {report.isPrivate ? <span>비공개</span> : null}
            </UserAndDate>
            <ButtonWrapper>
              {userEmail === email && (
                <>
                  <MyButton text={"수정하기"} type={"positive"} onClick={handleClickEdit} />
                  <MyButton text={"삭제하기"} type={"negative"} onClick={() => handleClickDelete(report.id)} />
                </>
              )}
            </ButtonWrapper>
          </SubTitle>
          <BookWrapper>
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
        <Like onClick={() => handleClickLike(report.author, report.id)}>
          <FontAwesomeIcon icon={like ? faHeartFill : faHeart} color="red" />
          {like ? likeCount : "좋아요"}
        </Like>
      </Container>
    );
  } else {
    return (
      <LoadingWrapper>
        <FontAwesomeIcon icon={faBookOpen} beatFade size="3x" />
      </LoadingWrapper>
    );
  }
};

export default Report;

const Container = styled.div`
  margin-left: 240px;
  margin-right: 240px;

  @media (max-width: 768px) {
    margin: 0;
  }
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

const BookWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid #ccc;
`;

const BookBackground = styled.div<BookBackgroundProps>`
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

const BookInfo = styled.div`
  font-family: "KyoboHandwriting2021sjy";
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  gap: 10px;
`;

const ReportTitle = styled.p`
  margin: 0;
  font-size: 40px;
  font-weight: bold;
  font-family: "KyoboHandwriting2021sjy";
`;

const UserAndDate = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  color: gray;
  font-style: italic;
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 5px;
  }
`;

const ProfileImage = styled.img`
  width: 25px;
  height: 25px;
  border: 1px solid #ccc;
  border-radius: 50%;
`;

const BookDescription = styled.span`
  color: #6f6f6f;
  font-size: 16px;
  line-height: 1.5;
`;

const BookTitle = styled.span`
  font-weight: bolder;
  font-size: 24px;
`;

const BookAuthor = styled.span`
  font-size: 16px;
`;

const SubTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const Like = styled.div`
  display: flex;
  color: gray;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
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

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
