import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Statistics = ({ IsLogin, reportList }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [targetBookNum, setTargetBookNum] = useState(0);
  const [booksPerMonth, setBooksPerMonth] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!IsLogin) {
      navigate("/login");
      alert("로그인 해주세요!");
    } else {
      const tempObj = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      };
      reportList.forEach((it) => {
        const month = new Date(it.date).getMonth() + 1;
        tempObj[month] += 1;
      });
      setBooksPerMonth({ ...tempObj });
    }
  }, [reportList]);

  const handleClickNextYear = () => {
    setYear((year) => year + 1);
  };

  const handleClickPrevYear = () => {
    setYear((year) => year - 1);
  };

  return (
    <Container>
      <Header>
        <Box>
          <Year>{year}</Year>
          <ArrowWrapper>
            <FontAwesomeIcon icon={faArrowUp} cursor={"pointer"} onClick={handleClickNextYear} />
            <FontAwesomeIcon icon={faArrowDown} cursor={"pointer"} onClick={handleClickPrevYear} />
          </ArrowWrapper>
        </Box>
        <Box>
          <Book>목표 독서량 : {targetBookNum}</Book>
        </Box>
      </Header>
      <Content>
        <Graph>
          {Object.values(booksPerMonth).map((value, index) => (
            <Month key={index}>
              <Bar value={`${value + 10}px`}></Bar>
              <span>{index + 1}</span>
            </Month>
          ))}
        </Graph>
      </Content>
    </Container>
  );
};

export default Statistics;

const Container = styled.div`
  margin-top: 50px;
  margin-left: 200px;
  margin-right: 200px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 130px;
  height: 50px;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  background-color: #e8e8e8;
`;

const Year = styled.div`
  font-size: 30px;
`;

const Book = styled.div`
  font-size: 18px;
`;

const ArrowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const Content = styled.div`
  margin-top: 50px;
`;

const Graph = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
`;

const Month = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Bar = styled.div`
  width: 20px;
  background-color: gray;
  height: ${(props) => props.value};
`;
