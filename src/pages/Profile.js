import { useEffect, useState } from "react";

import styled from "styled-components";

import ChangePassword from "../components/ChangePassword";
import MyProfile from "../components/MyProfile";
import MyButton from "../components/MyButton";

import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

const Profile = () => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [init, setInit] = useState(false);
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isChangePW, setIsChangePW] = useState(false);
  const [password, setPassword] = useState("");
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        setUsername(user.displayName);
        setPhotoURL(user.photoURL);
        setInit(true);
      }
    });
  }, []);

  const handleInput = (e) => {
    setPassword(e.target.value);
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

  const handleChangePW = () => setIsChangePW((prev) => !prev);

  return (
    init &&
    (isCorrect ? (
      <Container>
        {isChangePW ? (
          <ChangePassword email={email} setIsChangePW={setIsChangePW} handleChangePW={handleChangePW} />
        ) : (
          <MyProfile email={email} username={username} photoURL={photoURL} handleChangePW={handleChangePW} />
        )}
      </Container>
    ) : (
      <PasswordCheckContainer>
        <Info>비밀번호 확인</Info>
        <PasswordForm onSubmit={handleSubmit}>
          <Input name="password" type="password" value={password} onChange={handleInput} placeholder="현재 비밀번호" />
          <ButtonWrapper>
            <MyButton text={"비밀번호 확인"} type={"positive"} />
          </ButtonWrapper>
        </PasswordForm>
      </PasswordCheckContainer>
    ))
  );
};

export default Profile;

const Container = styled.div`
  position: relative;
  padding: 40px;
  margin-right: auto;
  margin-left: auto;
  width: 400px;
  height: 600px;
  /* border: 1px solid #ccc; */
  border-radius: 15px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: #ececec;
`;

const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: "KyoboHandwriting2021sjy";
`;

const Input = styled.input`
  width: 300px;
  font-size: 24px;
  font-family: "KyoboHandwriting2021sjy";
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #ececec;
`;

const PasswordCheckContainer = styled.div`
  background-color: #ececec;
  padding: 40px 0px;
  margin-top: 50px;
  margin-right: 100px;
  margin-left: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 70px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 15px;
`;

const Info = styled.div`
  font-weight: bold;
  font-size: 28px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  width: 300px;
`;
