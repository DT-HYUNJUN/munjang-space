import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled, { keyframes } from "styled-components";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../fbase";

import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

const Statistics = ({ IsLogin, reportList, userInfo }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportCount, setReportCount] = useState(0);
  const [targetBookNum, setTargetBookNum] = useState(0);
  const [isTarget, setIsTarget] = useState();
  const [barHeight, setBarHeight] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [ratio, setRatio] = useState(0);

  const inputRef = useRef();

  const navigate = useNavigate();

  const auth = getAuth();

  const getList = () => {
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
    const data = [];
    const barHeight = [];
    const yearFilterData = reportList.filter((it) => new Date(it.date).getFullYear() === year);
    setReportCount(yearFilterData.length);
    yearFilterData.forEach((it) => {
      const month = new Date(it.date).getMonth() + 1;
      tempObj[month] += 1;
    });
    Object.values(tempObj).map((value) => data.push(value));
    const maxData = Math.max(...data);
    data.forEach((it) => {
      const ratio = it / maxData;
      barHeight.push([ratio * 200, it]);
    });
    setBarHeight(barHeight);
  };

  const getTargetBookNum = async (email) => {
    const targetBookRef = doc(db, "reports", email);
    const targetBook = await getDoc(targetBookRef);
    const data = targetBook.data();
    return data?.targetBookNum;
  };

  const createTargetBookNum = async () => {
    console.log(targetBookNum);
    try {
      const targetBookRef = doc(db, "reports", userInfo.email);
      await updateDoc(targetBookRef, {
        targetBookNum,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getRatio = () => {
    const value = Math.floor((reportCount / targetBookNum) * 100);
    if (value) {
      value >= 100 ? setRatio(100) : setRatio(value);
    } else setRatio(0);
  };

  useEffect(() => {
    if (!IsLogin) {
      navigate("/login");
      alert("로그인 해주세요!");
    } else {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          getTargetBookNum(user.email).then((res) => {
            if (res) {
              setIsTarget(true);
              setTargetBookNum(res);
              getList();
            } else {
              setIsTarget(false);
            }
          });
        }
      });
    }
  }, [reportList, year, userInfo]);

  useEffect(() => {
    getRatio();
  }, [reportCount]);

  const handleClickNextYear = () => {
    setYear((year) => year + 1);
    getRatio();
  };

  const handleClickPrevYear = () => {
    setYear((year) => year - 1);
    getRatio();
  };

  const handleInput = (e) => {
    setTargetBookNum(e.target.value);
  };

  const handleClickEdit = () => {
    setIsEdit(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTargetBookNum(e.target.targetBookNum.value);
    createTargetBookNum();
    getRatio();
    setIsEdit(false);
  };

  const handleFirstSubmit = (e) => {
    e.preventDefault();
    setTargetBookNum(e.target.targetBookNum.value);
    createTargetBookNum();
    setIsTarget(true);
    getList();
  };

  return isTarget ? (
    <ContentContainer>
      <ImgWrapper>
        <QuoteImage src={process.env.PUBLIC_URL + "/images/quote.png"} alt="독서명언" />
      </ImgWrapper>
      <Container>
        <UserName>🦦 "{userInfo.username}" 님의 독후감 통계입니다.</UserName>
        <Header>
          <Box>
            <Year key={year}>{year}</Year>
            <ArrowWrapper>
              <FontAwesomeIcon icon={faArrowUp} cursor={"pointer"} onClick={handleClickNextYear} />
              <FontAwesomeIcon icon={faArrowDown} cursor={"pointer"} onClick={handleClickPrevYear} />
            </ArrowWrapper>
          </Box>
          <Box>
            {isEdit ? (
              <form onSubmit={handleSubmit}>
                <TargetInput ref={inputRef} name="targetBookNum" type="number" pattern="[0-9]+" value={targetBookNum} onChange={handleInput} />
              </form>
            ) : (
              <>
                <Book>목표 독서량 : {targetBookNum}</Book>
                <FontAwesomeIcon icon={faEdit} size="xs" onClick={handleClickEdit} cursor={"pointer"} style={{ position: "absolute", top: "4px", right: "4px" }} />
              </>
            )}
          </Box>
        </Header>
        <Content>
          <Graph>
            {barHeight.map((value, index) => (
              <Month key={index}>
                <Bar key={value[0]} value={`${value[0]}px`}>
                  {value[1] > 0 && value[1]}
                </Bar>
                <span>{index + 1}</span>
              </Month>
            ))}
          </Graph>
          <Target>
            <TargetBox>
              <TargetWrapper>
                <CircleGraph key={ratio} ratio={ratio}>
                  <CircleGraphCenter>{ratio}%</CircleGraphCenter>
                </CircleGraph>
                <ValueInfoWrapper>
                  <ValueInfo>목표 : {targetBookNum}권 중</ValueInfo>
                  <ValueInfo>
                    <BookValue>{reportCount}권 </BookValue> 읽었어요
                  </ValueInfo>
                </ValueInfoWrapper>
              </TargetWrapper>
            </TargetBox>
            <YearBook>
              <ValueInfo>1년 동안</ValueInfo>
              <BookValue>{reportCount}권 </BookValue>
            </YearBook>
            <YearBook>
              <ValueInfo>월 평균</ValueInfo>
              <BookValue>{Math.floor((reportCount / 12) * 100) / 100}권 </BookValue>
            </YearBook>
          </Target>
        </Content>
      </Container>
    </ContentContainer>
  ) : (
    <Container>
      <TargetForm onSubmit={handleFirstSubmit}>
        <Title>📖 연간 목표 독서량을 설정해보세요! 📖</Title>
        <FirstTargetInput ref={inputRef} name="targetBookNum" type="number" pattern="[0-9]+" value={targetBookNum} onChange={handleInput} autoFocus />
      </TargetForm>
    </Container>
  );
};

export default Statistics;

const Container = styled.div`
  margin-top: 20px;
  margin-left: 100px;
  margin-right: 100px;

  padding: 20px;
  border: 3px solid #ececec;
  border-radius: 3%;

  @media (max-width: 768px) {
    margin: 0;
    padding: 20px 5px;
  }
`;

const ContentContainer = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 50px;

  font-family: "UhBeeJJIBBABBA";
`;

const Box = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 150px;
  height: 50px;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  background-color: #e8e8e8;
`;

const Year = styled.div`
  font-size: 30px;
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Book = styled.div`
  font-size: 18px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
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
  min-height: 240px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 30px;
  margin: 50px 0;

  font-family: "UhBeeJJIBBABBA";

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const Month = styled.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const fillUp = keyframes`
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
`;

const Bar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  color: white;
  width: 20px;
  background-color: #4db8ff;
  height: ${(props) => props.value};
  animation: ${fillUp} ease-in-out 0.3s forwards;
  transform-origin: bottom;
`;

const TargetBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 320px;
  height: 100px;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  background-color: #e8e8e8;

  @media (max-width: 768px) {
    flex-grow: 1;
  }
`;

const TargetWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CircleGraph = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  animation: ${(props) => keyframes`
    0%{background : conic-gradient(#4db8ff 0% 0%, #ccc 0% 100%)}
    6%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 1}%, #ccc 0% 100%)}
    12%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 2}%, #ccc 0% 100%)}
    18%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 3}%, #ccc 0% 100%)}
    25%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 4}%, #ccc 0% 100%)}
    33%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 5}%, #ccc 0% 100%)}
    38%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 6}%, #ccc 0% 100%)}
    44%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 7}%, #ccc 0% 100%)}
    50%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 8}%, #ccc 0% 100%)}
    56%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 9}%, #ccc 0% 100%)}
    62%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 10}%, #ccc 0% 100%)}
    68%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 11}%, #ccc 0% 100%)}
    75%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 12}%, #ccc 0% 100%)}
    82%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 13}%, #ccc 0% 100%)}
    88%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 14}%, #ccc 0% 100%)}
    94%{background : conic-gradient(#4db8ff 0% ${(props.ratio / 17) * 15}%, #ccc 0% 100%)}
    100%{background : conic-gradient(#4db8ff 0% ${props.ratio}%, #ccc ${props.ratio}% 100%)}
  `}
    linear 0.3s forwards;
`;

const CircleGraphCenter = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 50px;
  height: 50px;
  background: #e8e8e8;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Target = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const TargetInput = styled.input`
  text-align: center;
  width: 100px;
  font-size: 20px;
  font-weight: bold;
  border: 0;
  background: none;
  border-radius: 5px;
  &:focus {
    outline: none;
  }
`;

const Title = styled.h1`
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const TargetForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: "UhBeeJJIBBABBA";
`;

const FirstTargetInput = styled.input`
  text-align: center;
  border: 0;
  font-size: 36px;
  font-family: "UhBeeJJIBBABBA";
  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const YearBook = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100px;
  height: 100px;

  padding: 5px 10px;

  border-radius: 5px;

  background-color: #e8e8e8;

  font-weight: bold;
  font-family: "UhBeeJJIBBABBA";

  @media (max-width: 768px) {
    flex-grow: 2;
  }
`;

const BookValue = styled.span`
  color: #4db8ff;
  font-size: 30px;
`;

const ValueInfo = styled.span`
  font-size: 18px;
  font-family: "UhBeeJJIBBABBA";
  color: gray;
`;

const ValueInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h1`
  margin-top: 0px;
  margin-bottom: 20px;
  font-size: 22px;
  font-family: "UhBeeJJIBBABBA";
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ImgWrapper = styled.div`
  display: flex;
  margin-right: auto;
  margin-left: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  border-radius: 5px;
  width: 80%;
  height: 120px;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`;

const QuoteImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
