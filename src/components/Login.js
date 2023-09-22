import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import styled from "styled-components";

import MyButton from "./MyButton";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Style
const Title = styled.h2`
  padding-left: 30px;
  padding-right: 30px;

  margin-bottom: 5px;

  text-align: center;
  font-family: "UhBeeJJIBBABBA";
  font-size: 30px;
`;

const Subtitle = styled.p`
  padding-left: 30px;
  padding-right: 30px;

  margin-top: 0px;

  text-align: center;
  font-family: "KyoboHandwriting2021sjy";
  font-size: 20px;
  color: gray;
`;

const LoginForm = styled.form`
  display: grid;
  justify-content: center;
`;

const Logininput = styled.input`
  border: 0px solid gray;
  border-radius: 3px;

  background-color: #ececec;
  color: black;

  width: 400px;
  height: 40px;

  margin-bottom: 10px;
  padding-left: 10px;

  font-family: "KyoboHandwriting2021sjy";
  font-size: 22px;

  cursor: pointer;
`;

const LoginWrapper = styled.div`
  display: grid;
`;

const SaveId = styled.label`
  font-family: "KyoboHandwriting2021sjy";
`;

const PwSee = styled.label`
  font-family: "KyoboHandwriting2021sjy";

  margin-left: 10px;
`;

const CheckBoxStyle = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-family: "KyoboHandwriting2021sjy";
`;

const LoginImg = styled.img`
  width: 100%;
`;

const KakaoLogin = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 10px;

  font-family: "UhBeeJJIBBABBA";
  color: gray;

  border-bottom: 1px solid gray;

  margin-top: 15px;
`;

//

const Login = () => {
  const REST_API_KEY = "d54df59401e33ca5fea835ed1e3862a1";
  const REDIRECT_URI = "http://localhost:3000";
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const inputRef = useRef();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 이메일 쿠키
  const [isRemember, setIsRemember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["rememberEmail"]);

  // 비밀번호 보이기
  const [passwordDisplay, setPasswordDisplay] = useState("password");
  const [isPassword, setIsPassword] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (cookies.rememberEmail !== undefined) {
      setEmail(cookies.rememberEmail);
      setIsRemember(true);
    }
  }, [cookies.rememberEmail]);

  // 쿠키 이벤트

  const onEmailHandle = (e) => setEmail(e.target.value);

  const handleOnChange = (e) => {
    setIsRemember(e.target.checked);
    if (e.target.checked) {
      setCookie("rememberEmail", email, { maxAge: 2000 });
    } else {
      removeCookie("rememberEmail");
    }
  };

  // 버튼 눌렀을때 동작 이벤트
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };

  // 비밀번호 보이기
  const handleDisplay = (e) => {
    setIsPassword(e.target.checked);
    if (e.target.checked) {
      setPasswordDisplay("text");
    } else {
      setPasswordDisplay("password");
    }
  };

  // 로그인 submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("이메일이 일치하지 않습니다.");
      } else if (error.code === "auth/wrong-password") {
        alert("비밀번호가 일치하지 않습니다.");
      } else {
        alert("입력하신 이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  return (
    <div>
      <div>
        <Title> 로그인 </Title>
        <Subtitle>문장의 공간과 함께 하세요.</Subtitle>
      </div>

      <LoginForm onSubmit={handleSubmit}>
        <LoginWrapper>
          <Label htmlFor="id_login">이메일*</Label>
          <Logininput
            ref={inputRef}
            type="text"
            name="userName"
            placeholder="Email"
            id="id_login"
            onChange={onEmailHandle}
            value={email}
          />
          <Label htmlFor="pw_login">비밀번호*</Label>
          <Logininput
            type={passwordDisplay}
            name="userPassword"
            placeholder="Password"
            id="pw_login"
            onChange={onPasswordHandler}
            value={password}
          />
        </LoginWrapper>

        <CheckBoxStyle>
          <SaveId htmlFor="remember-check">
            <input
              type="checkbox"
              id="remember-check"
              onChange={handleOnChange}
              checked={isRemember}
              defaultValue={email}
            />
            아이디 저장하기
          </SaveId>

          <PwSee htmlFor="remember-password">
            <input
              id="remember-password"
              type="checkbox"
              onChange={handleDisplay}
              checked={isPassword}
            />
            비밀번호 보이기
          </PwSee>
        </CheckBoxStyle>

        <MyButton text={"로그인"} type={"positive"} />

        <KakaoLogin>
          <p>카카오톡으로 시작하기</p>
          <a href={link}>
            <img
              src={process.env.PUBLIC_URL + "images/kakao_start.png"}
              alt="카카오톡 회원가입"
            />
          </a>
        </KakaoLogin>
      </LoginForm>

      <LoginImg
        src={process.env.PUBLIC_URL + "images/login_4.jpeg"}
        alt="login_img"
      />
    </div>
  );
};

export default Login;
