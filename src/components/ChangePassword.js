import { getAuth, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyButton from "./MyButton";

const ChangePassword = ({ email, setIsChangePW }) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState("");
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
        setError("");
      }
    } catch (error) {
      setError(error.message);
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
      setError("비밀번호가 다릅니다");
    }
  };

  return (
    <div>
      {isCorrect ? (
        <PasswordForm onSubmit={handleChangePassword}>
          <InputWrapper>
            <label htmlFor="newPassword">새 비밀번호</label>
            <Input id="newPassword" name="newPassword" type="password" value={newPassword} onChange={handleInput} placeholder="새 비밀번호" />
          </InputWrapper>
          <div>
            <label htmlFor="newPasswordCheck">새 비밀번호 확인</label>
            <Input id="newPasswordCheck" name="newPasswordCheck" type="password" value={newPasswordCheck} onChange={handleInput} placeholder="새 비밀번호 확인" />
          </div>
          <MyButton text={"비밀번호 변경"} type={"positive"} />
          <p>{error}</p>
        </PasswordForm>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input name="password" type="password" value={password} onChange={handleInput} />
          <input type="submit" value="확인" />
          <p>{error}</p>
        </form>
      )}
    </div>
  );
};

export default ChangePassword;

const Input = styled.input`
  /* width: 300px; */
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
  gap: 15px;
`;

const InputWrapper = styled.div`
  width: 300px;
`;
