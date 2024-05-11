import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";

import styled from "styled-components";

import MyButton from "../Global/MyButton";
import ReactStars from "react-stars";
import { IReport } from "../../types";

interface Props {
  reportList: IReport[];
  onDelete: (id: string) => void;
}

const ReportContentList = (props: Props) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChage = (page: number) => {
    setPage(page);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = props.reportList.slice(startIndex, endIndex);

  const navigate = useNavigate();

  const goDetail = (email: string, id: string) => {
    navigate(`/report/${email}/${id}`);
  };

  const goEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  // delete 할때 alert 창
  const handleDelete = (item: IReport) => {
    if (window.confirm("독후감을 삭제 하겠습니까?")) {
      props.onDelete(item.id);
      window.alert("삭제되었습니다.");
      console.log(item);
    } else {
      window.alert("취소 되었습니다.");
    }
  };

  return (
    <div>
      <div>
        {currentPageData.map((item) => (
          <ReportContent key={item.id}>
            <ImageContent onClick={() => goDetail(item.author, item.id)}>
              <BookImg src={item.book.cover} alt="book" />
              <InfoContent>
                <ReportTitle>{item.title}</ReportTitle>
                <ReportRemain>
                  <p>{item.book.title}</p>
                  <p>{item.isPrivate ? "비공개" : "공개"}</p>
                  <ReportRating>
                    <ReactStars value={item.star} edit={false} size={24} />
                  </ReportRating>
                  <p>{new Date(item.date).toLocaleDateString()}</p>
                </ReportRemain>
              </InfoContent>
            </ImageContent>

            <EditButton>
              <MyButton text={"수정하기"} type={"positive"} onClick={() => goEdit(item.id)} />
              <MyButton
                text={"삭제하기"}
                type={"negative"}
                onClick={() => {
                  handleDelete(item);
                }}
              />
            </EditButton>
          </ReportContent>
        ))}
        {currentPageData.length !== 0 && (
          <Pagination activePage={page} itemsCountPerPage={5} totalItemsCount={props.reportList.length} pageRangeDisplayed={5} prevPageText={"<"} nextPageText={">"} onChange={handlePageChage} />
        )}
      </div>
    </div>
  );
};

ReportContentList.defaultProps = {
  reportList: [],
};

export default ReportContentList;

const BookImg = styled.img`
  cursor: pointer;
  width: 200px;

  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;

  border: 1px solid black;

  @media (max-width: 768px) {
    margin: 0;
    width: 140px;
    height: 200px;
  }
`;

const ReportContent = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e2e2e2;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }
`;

const ImageContent = styled.div`
  display: flex;
  gap: 100px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
`;

const InfoContent = styled.div`
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ReportTitle = styled.p`
  font-family: "UhBeeJJIBBABBA";
  font-size: 23px;

  margin-bottom: 50px;

  cursor: pointer;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const ReportRemain = styled.div`
  font-family: "KyoboHandwriting2021sjy";
  font-size: 22px;

  cursor: pointer;
`;

const EditButton = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;

  @media (max-width: 768px) {
    align-items: center;
    margin-top: 0;
  }
`;

const ReportRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;
