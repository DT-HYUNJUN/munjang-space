import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import styled from "styled-components";

interface Props {
  IsLogin: boolean;
}

const MyHeader = (props: Props) => {
  // 로그인 할때 유저네임 firebase에서 가져오기
  const [username, setUsername] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const username = user.displayName;
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
    <HeaderContainer>
      <div>
        <LeftNavLink to="/">
          <Logo>
            <LogoImg src={process.env.PUBLIC_URL + "/images/dog.png"} alt="logoImg" />
            <LogoHeadText>문장의 공간</LogoHeadText>
          </Logo>
        </LeftNavLink>
      </div>

      <div>
        <NavBar>
          <NavBarLink to="/">Home</NavBarLink>
          <NavBarLink to="/list">나의 서재</NavBarLink>
          <NavBarLink to="/statistics">나의 통계</NavBarLink>

          <NavBarLink to={props.IsLogin ? "/profile" : "/login"}>{props.IsLogin ? "나의 정보" : "로그인"}</NavBarLink>

          <NavBarLink to="/signup">{props.IsLogin ? " " : "회원가입"}</NavBarLink>

          {props.IsLogin ? <Logout onClick={onLogOutClick}>로그아웃</Logout> : " "}
        </NavBar>
        <LoginInformation>{username && `${username} 님 독후감을 작성해보세요 😀`}</LoginInformation>
      </div>
    </HeaderContainer>
  );
};

export default MyHeader;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
  }
`;

const LeftNavLink = styled(NavLink)`
  text-decoration: none;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 100.82px;
  height: 126.88px;
`;

const LogoHeadText = styled.h2`
  font-family: "UhBeeJJIBBABBA";
  font-size: 50px;
  color: black;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavBar = styled.div`
  font-size: 20px;
  font-family: "UhBeeJJIBBABBA";
  font-weight: bolder;

  padding-right: 20px;

  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    display: flex;
    padding: 10px 10px 5px 10px;
    font-size: 14px;
  }
`;

const NavBarLink = styled(NavLink)`
  text-decoration: none;
  color: black;

  &:hover {
    color: #4db8ff;
    border-bottom: 2px solid;
  }

  &:active {
    color: #4db8ff;
    border-bottom: 2px solid;
  }
`;

const LoginInformation = styled.div`
  font-family: "UhBeeJJIBBABBA";
  display: flex;
  justify-content: end;

  margin-top: 3px;
  margin-right: 30px;
  color: #9ad8dc;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    margin: 0;
  }
`;

const Logout = styled.span`
  cursor: pointer;
`;
