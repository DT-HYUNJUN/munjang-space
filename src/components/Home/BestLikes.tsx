import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import getLikeReports from "../../utils/getLikeReports";
import { IReport } from "../../types";

interface BookBackgroundProps {
  backgroundImage: string;
}

interface Props {
  likeReports: IReport[];
  handleClickLikeReports: () => void;
}

const BestLikes = (props: Props) => {
  const navigate = useNavigate();

  const handleClickReport = (email: string, id: string) => {
    navigate(`/report/${email}/${id}`);
  };
  return (
    <div>
      <BigTitleLike>
        지금 인기있는 독후감은?{" "}
        <RefreshButton onClick={props.handleClickLikeReports}>
          <FontAwesomeIcon icon={faRefresh} />
        </RefreshButton>
      </BigTitleLike>

      <BestLikesReport>
        {props.likeReports.slice(0, 5).map((it, idx) => (
          <LikeReport key={idx}>
            <BookBackground backgroundImage={it.book.cover} onClick={() => handleClickReport(it.author, it.id)}></BookBackground>
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
    </div>
  );
};

export default BestLikes;

const BigTitleLike = styled.h1`
  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  margin-bottom: 0px;
  margin-top: 70px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const BestLikesReport = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 50px;

  margin-bottom: 70px;
  margin-top: 20px;

  @media (max-width: 768px) {
    gap: 5px;
    grid-template-columns: repeat(2, 1fr);
  }
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

  @media (max-width: 768px) {
    width: 120px;
    height: 200px;
  }
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

const BookBackground = styled.div<BookBackgroundProps>`
  cursor: pointer;
  position: absolute;

  border-radius: 30px;

  overflow: hidden;

  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;

  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center center;

  width: 100%;
  height: 100%;

  opacity: 0.2;

  filter: blur(32px);

  z-index: 2;
  overflow: hidden;
`;
