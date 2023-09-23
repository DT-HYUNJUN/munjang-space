import { useState } from "react";

import styled from "styled-components";

import All from "../components/All";
import Month from "../components/Month";

const SwitchButton = styled.div``;

const AllButton = styled.button`
  margin-right: 15px;

  border: 0;
  border-radius: 30px;
  cursor: pointer;

  white-space: nowrap;
  font-family: "UhBeeJJIBBABBA";
  font-size: 20px;
  padding: 10px 15px;

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
  font-size: 20px;
  padding: 10px 15px;

  color: white;
  background-color: #9ad8dc;

  &:hover {
    background-color: #4db8ff;
  }
`;

const List = () => {
  const [all, setAll] = useState(false);

  const onAllHandler = () => setAll(true);
  const onMonthHandler = () => setAll(false);

  return (
    <div>
      <SwitchButton>
        <AllButton onClick={onAllHandler}>전체</AllButton>
        <MonthButton onClick={onMonthHandler}>월별</MonthButton>
      </SwitchButton>
      {all ? <All /> : <Month />}
    </div>
  );
};

export default List;
