import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import All from "../components/All";
import Month from "../components/Month";
import MyButton from "../components/MyButton";

const sortOptionList = [
  { value: "latest", name: "최신순" },
  { value: "oldest", name: "오래된 순" },
];

const sortStarOptionList = [
  { value: "allStar", name: "전부" },
  { value: 1, name: "1" },
  { value: 2, name: "2" },
  { value: 3, name: "3" },
  { value: 4, name: "4" },
  { value: 5, name: "5" },
];

const sortPrivateOptionList = [
  { value: "true", name: "공개" },
  { value: "false", name: "비공개" },
];

const ControlMenu = ({ value, onChange, optionList }) => {
  return (
    <FilterSelect value={value} onChange={(e) => onChange(e.target.value)}>
      {optionList.map((it, idx) => (
        <option key={idx} value={it.value}>
          {it.name}
        </option>
      ))}
    </FilterSelect>
  );
};

const List = ({ reportList }) => {
  const navigate = useNavigate();
  const [all, setAll] = useState(false);

  const onAllHandler = () => setAll(true);
  const onMonthHandler = () => setAll(false);

  const [sortType, setSortType] = useState("latest");

  const [filterStar, setFilterStar] = useState("allStar");

  const [filterPrivate, setFilterPrivate] = useState("true");

  const getProcessReportList = () => {
    const compare = (a, b) => {
      if (sortType === "latest") {
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    const copyList = JSON.parse(JSON.stringify(reportList));

    const filterdStarList = filterStar === "allStar" ? copyList : copyList.filter((it) => parseInt(it.star) === parseInt(filterStar));

    const sortedList = filterdStarList.sort(compare);

    const filterPrivateList = filterPrivate === "true" ? sortedList.filter((it) => it.isPrivate === true) : sortedList.filter((it) => it.isPrivate === false);

    return filterPrivateList;
  };

  return (
    <div>
      <div>
        <AllButton onClick={onAllHandler}>전체</AllButton>
        <MonthButton onClick={onMonthHandler}>월별</MonthButton>
      </div>

      <div>
        <ControlHeader>
          <ControlFilter>
            <ControlMenu value={sortType} onChange={setSortType} optionList={sortOptionList} />

            <ControlMenu value={filterStar} onChange={setFilterStar} optionList={sortStarOptionList} />

            <ControlMenu value={filterPrivate} onChange={setFilterPrivate} optionList={sortPrivateOptionList} />
          </ControlFilter>

          <MyButton type={"positive"} text={"새 독후감 작성하기"} onClick={() => navigate("/new")} />
        </ControlHeader>
        {all ? <All reportList={getProcessReportList()} /> : <Month reportList={getProcessReportList()} />}
      </div>
    </div>
  );
};

export default List;

const AllButton = styled.button`
  margin-right: 15px;

  border: 0;
  border-radius: 30px;
  cursor: pointer;

  white-space: nowrap;
  font-family: "UhBeeJJIBBABBA";
  font-size: 18px;
  padding: 10px;

  color: white;
  background-color: #9ad8dc;

  &:hover {
    background-color: #4db8ff;
  }
`;

const MonthButton = styled.button`
  border: 0;
  border-radius: 30px;
  cursor: pointer;

  white-space: nowrap;
  font-family: "UhBeeJJIBBABBA";
  font-size: 18px;
  padding: 10px;

  color: white;
  background-color: #9ad8dc;

  &:hover {
    background-color: #4db8ff;
  }
`;

const FilterSelect = styled.select`
  border: none;
  border-radius: 5px;
  background-color: #ececec;

  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;

  cursor: pointer;
  font-family: "UhBeeJJIBBABBA";
  font-size: 18px;

  width: 30%;

  margin-right: 5px;
`;

const ControlHeader = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
`;

const ControlFilter = styled.div`
  width: 50%;
`;
