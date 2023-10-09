import { useState } from "react";
import Pagination from "react-js-pagination";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import MyButton from "./MyButton";
import ReactStars from "react-stars";

const ReportContentList = ({ reportList }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChage = (page) => {
    setPage(page);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = reportList.slice(startIndex, endIndex);

  const navigate = useNavigate();

  const goDetail = (id) => {
    navigate(`/report/${id}`);
  };

  return (
    <div>
      <div>
        {currentPageData.map((item) => (
          <ReportContent key={item.id}>
            <ImageContent onClick={() => goDetail(item.id)}>
              <BookImg src={item.book.cover} alt="book" />
              <div>
                <ReportTitle>독후감 제목: {item.title}</ReportTitle>
                <ReportRemain>
                  <p>책 제목: {item.book.title}</p>
                  <p>공개 여부: {item.isPrivate ? "참" : "거짓"}</p>
                  <ReportRating>
                    별점 : <ReactStars value={item.star} edit={false} size={24} />
                  </ReportRating>
                  <p>
                    작성 날:
                    {new Date(parseInt(item.date)).toLocaleDateString()}
                  </p>
                </ReportRemain>
              </div>
            </ImageContent>

            <EditButton>
              <MyButton text={"수정하기"} type={"negative"} onClick={() => navigate("/edit")} />
            </EditButton>
          </ReportContent>
        ))}
        {currentPageData.length !== 0 && (
          <Pagination activePage={page} itemsCountPerPage={5} totalItemsCount={reportList.length} pageRangeDisplayed={5} prevPageText={"<"} nextPageText={">"} onChange={handlePageChage} />
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
`;

const ReportContent = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e2e2e2;
`;

const ImageContent = styled.div`
  display: flex;
  gap: 100px;
`;

const ReportTitle = styled.p`
  font-family: "UhBeeJJIBBABBA";
  font-size: 23px;

  margin-bottom: 50px;

  cursor: pointer;
`;

const ReportRemain = styled.div`
  font-family: "KyoboHandwriting2021sjy";
  font-size: 22px;

  cursor: pointer;
`;

const EditButton = styled.div`
  margin-top: 20px;
  cursor: pointer;
`;

const ReportRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
