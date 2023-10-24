import { useState } from "react";

import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import MyButton from "./MyButton";

import styled from "styled-components";

const ChangePassword = ({ email, setIsChangePW, handleChangePW }) => {
  const [isCorrect, setIsCorrect] = useState(true);

  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");

  const auth = getAuth();

  const handleInput = (e) => {
    const name = e.target.name;
    if (name === "password") {
      setPassword(e.target.value);
    } else if (name === "newPassword") {
      setNewPassword(e.target.value);
    } else if (name === "newPasswordCheck") {
      setNewPasswordCheck(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data;
    try {
      data = await signInWithEmailAndPassword(auth, email, password);
      if (data) {
        setIsCorrect(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword === newPasswordCheck) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        setIsChangePW(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setNewPassword("");
      setNewPasswordCheck("");
      alert("비밀번호를 확인해주세요.");
    }
  };

  return (
    <Container>
      <BackWrapper>
        <FontAwesomeIcon onClick={handleChangePW} icon={faChevronLeft} />
      </BackWrapper>
      {isCorrect ? (
        <PasswordForm onSubmit={handleChangePassword}>
          <label htmlFor="newPassword">새 비밀번호</label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={handleInput}
            placeholder="새 비밀번호"
          />
          <label htmlFor="newPasswordCheck">새 비밀번호 확인</label>
          <Input
            id="newPasswordCheck"
            name="newPasswordCheck"
            type="password"
            value={newPasswordCheck}
            onChange={handleInput}
            placeholder="새 비밀번호 확인"
          />
          <MyButton text={"비밀번호 변경"} type={"positive"} />
        </PasswordForm>
      ) : (
        <PasswordForm onSubmit={handleSubmit}>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={handleInput}
            placeholder="현재 비밀번호"
          />
          <MyButton text={"비밀번호 확인"} type={"positive"} />
        </PasswordForm>
      )}
    </Container>
  );
};

export default ChangePassword;

const Input = styled.input`
  width: 300px;
  font-size: 24px;
  font-family: "KyoboHandwriting2021sjy";
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #ececec;
`;

const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: "KyoboHandwriting2021sjy";
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BackWrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
`;
