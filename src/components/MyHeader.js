import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import styled from "styled-components";

const MyHeader = ({ IsLogin }) => {
  // 로그인 할때 유저네임 firebase에서 가져오기
  const [username, setUsername] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const username = user.displayName;
        console.log(username);
        setUsername(username);
      } else {
        setUsername(null);
      }
    });
  }, [auth]);

  const navigate = useNavigate();

  const onLogOutClick = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <div className="Header">
      <div className="LeftHeader">
        <NavLink to="/">
          <div className="Logo">
            <img className="logoImg" src={process.env.PUBLIC_URL + "/images/dog.png"} alt="logoImg" />
            <h2>문장의 공간</h2>
          </div>
        </NavLink>
      </div>

      <div>
        <div className="NavBar">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/list">나의 서재</NavLink>
          <NavLink to="/statistics">나의 통계</NavLink>

          <NavLink to={IsLogin ? "/profile" : "/login"}>{IsLogin ? "나의 정보" : "로그인"}</NavLink>

          <NavLink to="/signup">{IsLogin ? " " : "회원가입"}</NavLink>

          {IsLogin ? <Logout onClick={onLogOutClick}>로그아웃</Logout> : " "}
        </div>
        <LoginInformation>{username && `${username} 님 독후감을 작성해보세요 😀`}</LoginInformation>
      </div>
    </div>
  );
};

export default MyHeader;

const LoginInformation = styled.div`
  font-family: "UhBeeJJIBBABBA";
  display: flex;
  justify-content: end;

  margin-top: 3px;
  margin-right: 30px;
  color: #9ad8dc;
`;

const Logout = styled.span`
  cursor: pointer;
`;
