import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import getBooks from "../utils/getBooks";
import MyButton from "../components/Global/MyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { collection, onSnapshot, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../fbase";
import { IBook } from "../types";
import Loading from "../components/Global/Loading";

interface IAllReports {
  id: string;
  title: string;
  content: string;
  email: string;
  username: string;
  profileImage: string;
  date: number;
}

type GoToReport = {
  (email: string, id: string): void;
};

type HandleBookClick = {
  (title: string, cover: string, author: string, description: string, isbn13: string): void;
};

const Book = () => {
  const { isbn13 } = useParams() as { isbn13: string };

  const [data, setData] = useState<IBook>({
    isbn13: "",
    title: "",
    author: "",
    cover: "",
    description: "",
  });

  const [bookReports, setBookReports] = useState<IAllReports[]>([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const goToThisBookReport = () => {
    navigate(`/thisbookreport/${isbn13}`);
  };

  const goToReport: GoToReport = (email, id) => {
    navigate(`/report/${email}/${id}`);
  };

  // 로딩
  useEffect(() => {
    setLoading(false);
    try {
      setLoading(true);
      getBookReports(isbn13).then((res) => {
        setBookReports(res.sort((a, b) => b.date - a.date));
      });
      getBooks(isbn13).then((res) => {
        setData(res[0]);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  }, [isbn13]);

  const handleBookClick: HandleBookClick = (title, cover, author, description, isbn13) => {
    navigate("/new", {
      state: {
        title: title,
        cover: cover,
        author: author,
        description: description,
        isbn13: isbn13,
      },
    });
  };

  const getBookReports = async (isbn13: string): Promise<IAllReports[]> => {
    return new Promise(async (resolve, reject) => {
      const reportsCollectionRef = collection(db, "reports");
      const allReports: IAllReports[] = [];

      onSnapshot(reportsCollectionRef, async (snapshot) => {
        const promises = snapshot.docChanges().map(async (change) => {
          if (change.type === "added" || change.type === "modified") {
            const doc = change.doc;
            const booksCollectionRef = collection(doc.ref, "books");
            const q = query(booksCollectionRef, where("book.isbn13", "==", isbn13), orderBy("date", "desc"), where("isPrivate", "==", false));
            const booksQuerySnapshot = await getDocs(q);

            booksQuerySnapshot.forEach((bookData) => {
              const bookInfo = bookData.data();
              const titleOutTags = bookInfo.content.replace(/(<([^>]+)>)/gi, "");

              allReports.push({
                id: bookData.id,
                title: bookInfo.title,
                content: titleOutTags,
                email: bookInfo.author,
                username: bookInfo.username,
                profileImage: bookInfo.profileImage,
                date: bookInfo.date,
              });
            });
          }
        });
        await Promise.all(promises);
        resolve(allReports);
      });
    });
  };

  return loading ? (
    <Loading />
  ) : (
    <BookDetailEntire>
      <BookContent>
        <BookCover src={data.cover} alt="bookcover" />
        <div>
          <BookTitle>{data.title}</BookTitle>
          <BookAuthor>{data.author}</BookAuthor>
          <BookCategory>{data.categoryName}</BookCategory>
          <BookIsbn13>isbn13 : {data.isbn13}</BookIsbn13>
          <ButtonWrapper>
            <MyButton
              type={"positive"}
              text={"종이책 구매"}
              onClick={() => {
                window.location.href = data.link!;
              }}
            />
            <WriteButton onClick={() => handleBookClick(data.title, data.cover, data.author, data.description, data.isbn13)}>독후감 작성하기</WriteButton>
          </ButtonWrapper>
        </div>
      </BookContent>

      <BookIntroWrapper>
        <BookIntroduction>책소개</BookIntroduction>
        <BookIntroductionContent>{data.description}</BookIntroductionContent>
      </BookIntroWrapper>

      <ThisReportWrapper>
        <ThisReport>이 책의 독후감</ThisReport>
        <FontAwesomeIcon onClick={goToThisBookReport} icon={faArrowRight} cursor={"pointer"} />
      </ThisReportWrapper>

      <ThisBookReport>
        {bookReports.slice(0, 5).map((report, idx) => (
          <BookReport key={idx} onClick={() => goToReport(report.email!, report.id)}>
            <ReportTitle>{report.title}</ReportTitle>
            <ReportContent>{report.content}</ReportContent>
            <ReportFooter>
              <ReportAuthorProfileImage src={report.profileImage} alt={report.username} />
              <ReportAuthor>{report.username}</ReportAuthor>
            </ReportFooter>
          </BookReport>
        ))}
      </ThisBookReport>
    </BookDetailEntire>
  );
};

export default Book;

const BookDetailEntire = styled.div`
  font-family: "KyoboHandwriting2021sjy";
`;

const BookContent = styled.div`
  display: flex;
  gap: 100px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

const BookTitle = styled.p`
  font-size: 35px;
  font-weight: bold;

  margin-top: 0px;
  margin-bottom: 0px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const BookAuthor = styled.p`
  font-size: 20px;
  color: gray;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const BookCategory = styled.p`
  font-size: 15px;
  color: gray;
`;

const BookIsbn13 = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: gray;
`;

const BookCover = styled.img`
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  margin-left: 30px;

  margin-bottom: 30px;

  @media (max-width: 768px) {
    width: 200px;
    height: 300px;
    margin: 0;
  }
`;

const BookIntroduction = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`;

const BookIntroductionContent = styled.p`
  font-size: 20px;
  text-align: left;
  line-height: 35px;
`;

const ThisReport = styled.h1`
  margin-bottom: 20px;
`;
const BookReport = styled.div`
  border-radius: 15%;

  width: 230px;
  height: 230px;

  margin-right: 20px;

  text-align: center;

  background-color: #ededed;
  box-shadow: 12px 0px 11px -3px rgba(0, 0, 0, 0.1);

  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
    height: 160px;
    margin: 0;
  }
`;

const WriteButton = styled.button`
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  background-color: #fffb85;

  font-family: "UhBeeJJIBBABBA";
  font-size: 18px;

  color: black;

  margin-left: 20px;
  padding: 10px 15px;
  white-space: nowrap;
  &:hover {
    background-color: #f7f25e;
  }

  @media (max-width: 768px) {
    margin: 0;
  }
`;

const ThisBookReport = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }
`;

const ReportTitle = styled.div`
  font-family: "UhBeeJJIBBABBA";
  font-weight: bold;
  font-size: 18px;

  height: 20%;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  padding: 10px 14px 0px 14px;
`;

const ReportContent = styled.div`
  border-bottom: 1px solid #ccc;

  padding: 10px;

  height: 50%;

  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ReportFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  padding-top: 5px;
`;

const ReportAuthor = styled.span`
  text-align: center;
  bottom: 0;
`;

const ReportAuthorProfileImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 75px;
`;

const ThisReportWrapper = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;
  margin-top: 50px;

  border-top: 4px solid #ececec;
`;

const BookIntroWrapper = styled.div`
  border-top: 4px solid #ececec;
`;

const ButtonWrapper = styled.div`
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 20px;
  }
`;
