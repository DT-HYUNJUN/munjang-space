import { useEffect, useState } from "react";

import styled from "styled-components";

import Mybutton from "../components/MyButton";
import ReportContentList from "./ReportContentList";

const MyHeader = ({ headText, leftChild, rightChild }) => {
  return (
    <MonthHeader>
      <LeftButton>{leftChild}</LeftButton>
      <HeadText>{headText}</HeadText>
      <RightButton>{rightChild}</RightButton>
    </MonthHeader>
  );
};

const Month = ({ reportList }) => {
  const [data, setData] = useState([]);
  const [curDate, setCurDate] = useState(new Date());

  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  const increaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate())
    );
  };

  const decreaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate())
    );
  };

  useEffect(() => {
    const firstDay = new Date(
      curDate.getFullYear(),
      curDate.getMonth(),
      1
    ).getTime();

    const lastDay = new Date(
      curDate.getFullYear(),
      curDate.getMonth() + 1,
      0
    ).getTime();

    setData(
      reportList.filter((it) => firstDay <= it.date && it.date <= lastDay)
    );
  }, [reportList, curDate]);

  return (
    <div>
      <MyHeader
        headText={headText}
        leftChild={<Mybutton text={"<"} onClick={decreaseMonth} />}
        rightChild={<Mybutton text={">"} onClick={increaseMonth} />}
      />
      <ReportContentList reportList={data} />
    </div>
  );
};

export default Month;

const MonthHeader = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;

  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e2e2;

  font-size: 25px;
  font-family: "UhBeeJJIBBABBA";
`;

const HeadText = styled.div`
  width: 50%;
  justify-content: center;
  text-align: center;
`;

const LeftButton = styled.div`
  width: 25%;
  justify-content: start;
`;

const RightButton = styled.div`
  width: 25%;
  justify-content: right;
  text-align: right;
`;
