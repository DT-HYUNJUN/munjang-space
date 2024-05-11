import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import styled from "styled-components";

import MyButton from "../components/Global/MyButton";

import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../fbase";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 이메일 쿠키
  const [isRemember, setIsRemember] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["rememberEmail"]);

  // 비밀번호 보이기
  const [passwordDisplay, setPasswordDisplay] = useState("password");
  const [isPassword, setIsPassword] = useState(false);

  // caps lock 기능
  const [capsLockFlag, setCapsLockFlag] = useState(false);

  // 구글 로그인

  const [userData, setUserData] = useState<User>();

  const handleGoogleLogin = async (): Promise<void> => {
    const provider = new GoogleAuthProvider(); //Provider 설정
    const auth = getAuth();
    try {
      const data = await signInWithPopup(auth, provider);

      if (!data.user || !data.user.email) {
        throw new Error("이메일 정보를 가져올 수 없습니다.");
      }

      const username = data.user.displayName;
      localStorage.setItem("isSocial", JSON.stringify(true));

      const reportsRef = collection(db, "reports");
      const reportsDocRef = doc(reportsRef, data.user.email);
      await setDoc(reportsDocRef, { username });

      const usersRef = collection(db, "users");
      const usersDocRef = doc(usersRef, data.user.email);
      await setDoc(usersDocRef, { username });

      setUserData(data.user); // user data 설정
      navigate("/"); // 로그인시 홈으로 이동
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  // 쿠키 이벤트
  useEffect(() => {
    if (cookies.rememberEmail !== undefined) {
      setEmail(cookies.rememberEmail);
      setIsRemember(true);
    }
  }, [cookies.rememberEmail]);

  const onEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRemember(e.target.checked);
    if (e.target.checked) {
      setCookie("rememberEmail", email, { maxAge: 2000 });
    } else {
      removeCookie("rememberEmail");
    }
  };

  // 버튼 눌렀을때 동작 이벤트
  const onPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  // 비밀번호 보이기
  const handleDisplay = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPassword(e.target.checked);
    if (e.target.checked) {
      setPasswordDisplay("text");
    } else {
      setPasswordDisplay("password");
    }
  };

  // 로그인 submit

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isSocial", "false");
      navigate("/");
    } catch (error) {
      if ((error as FirebaseError).code === "auth/user-not-found") {
        alert("이메일이 일치하지 않습니다.");
      } else if ((error as FirebaseError).code === "auth/wrong-password") {
        alert("비밀번호가 일치하지 않습니다.");
      } else {
        alert("입력하신 이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  // capsLock

  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let capsLock = e.getModifierState("CapsLock");
    setCapsLockFlag(capsLock);
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
          <Logininput ref={inputRef} type="text" name="userName" placeholder="Email" id="id_login" onKeyDown={(e) => checkCapsLock(e)} onChange={onEmailHandler} value={email} />
          <Label htmlFor="pw_login">비밀번호*</Label>
          <Logininput type={passwordDisplay} name="userPassword" placeholder="Password" id="pw_login" onKeyDown={(e) => checkCapsLock(e)} onChange={onPasswordHandler} value={password} />
        </LoginWrapper>

        <CheckBoxStyle>
          <SaveId htmlFor="remember-check">
            <input type="checkbox" id="remember-check" onChange={handleOnChange} checked={isRemember} defaultValue={email} />
            아이디 저장하기
          </SaveId>

          <PwSee htmlFor="remember-password">
            <input id="remember-password" type="checkbox" onChange={handleDisplay} checked={isPassword} />
            비밀번호 보이기
          </PwSee>

          <CapsLockSpan className={capsLockFlag ? "caps-lock caps-lock-on" : "caps-lock"}>{capsLockFlag ? <CapsOn>Caps Lock ON</CapsOn> : <CapsOff>Caps Lock Off</CapsOff>}</CapsLockSpan>
        </CheckBoxStyle>

        <MyButton text={"로그인"} type={"positive"} />

        <GoogleLogin>
          <p>구글로 시작하기</p>
          <div>
            <Google onClick={handleGoogleLogin} src={process.env.PUBLIC_URL + "images/google2.png"} alt="google_ctn" />
          </div>
        </GoogleLogin>
      </LoginForm>

      <LoginImg src={process.env.PUBLIC_URL + "images/login_4.jpeg"} alt="login_img" />
    </div>
  );
};

export default Login;

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

  @media (max-width: 768px) {
    width: 300px;
  }
`;

const LoginWrapper = styled.div`
  display: grid;
`;

const SaveId = styled.label`
  font-family: "KyoboHandwriting2021sjy";

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const PwSee = styled.label`
  font-family: "KyoboHandwriting2021sjy";

  margin-left: 10px;
  margin-right: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CheckBoxStyle = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-family: "KyoboHandwriting2021sjy";
`;

const LoginImg = styled.img`
  width: 100%;
`;

const GoogleLogin = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 10px;

  font-family: "UhBeeJJIBBABBA";
  font-size: 18px;
  color: gray;

  border-bottom: 1px solid gray;

  margin-top: 15px;
  padding-bottom: 10px;
`;

const CapsLockSpan = styled.span`
  display: inline-block;
  vertical-align: baseline;

  font-size: 12px;
  font-weight: 800;
  font-family: "UhBeeJJIBBABBA";

  color: white;
  border-radius: 0.5rem;
`;

const CapsOn = styled.span`
  background-color: red;
  padding-left: 3px;
  padding-right: 3px;
`;

const CapsOff = styled.span`
  background-color: green;
  padding-left: 3px;
  padding-right: 3px;
`;

const Google = styled.img`
  cursor: pointer;
`;
