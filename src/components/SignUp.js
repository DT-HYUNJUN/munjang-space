import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { authService } from "../fbase";
import { useState } from "react";
import styled from "styled-components";
import MyButton from "./MyButton";
import { useNavigate } from "react-router-dom";

const StyledInput = styled.input`
  border: 1px solid gray;
  border-radius: 3px;
  background-color: #ececec;
  color: black;
  width: 400px;
  height: 40px;
`;

const FormContainer = styled.form`
  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px; */
  display: grid;
  justify-content: center;
  gap: 10px;
`;

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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [username, setUsername] = useState("");
  const [errorText, setErrorText] = useState("");

  const navigate = useNavigate();

  const handleInput = (e) => {
    const inputName = e.target.name;
    const value = e.target.value;
    if (inputName === "email") {
      setEmail(value);
    } else if (inputName === "password") {
      setPassword(value);
    } else if (inputName === "passwordCheck") {
      setPasswordCheck(value);
    } else if (inputName === "username") {
      setUsername(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === passwordCheck) {
        let data;
        const auth = getAuth();
        data = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(data.user, { displayName: username });
        navigate("/");
      } else {
        setErrorText("비밀번호가 다릅니다.");
      }
    } catch (error) {
      setErrorText(error.message);
    }
  };

  return (
    <div>
      <FormContainer onSubmit={handleSubmit}>
        <Title>회원가입</Title>
        <Subtitle>문장의 공간과 함께 하세요.</Subtitle>
        <StyledInput onChange={handleInput} name="email" value={email} type="email" placeholder="이메일" required />
        <StyledInput onChange={handleInput} name="password" value={password} type="password" placeholder="비밀번호" required />
        <StyledInput onChange={handleInput} name="passwordCheck" value={passwordCheck} type="password" placeholder="비밀번호 확인" required />
        <StyledInput onChange={handleInput} name="username" value={username} type="text" placeholder="사용자 이름" required />
        <MyButton text={"회원가입"} type={"positive"} />
        {errorText && <p>{errorText}</p>}
      </FormContainer>
    </div>
  );
};

export default SignUp;
