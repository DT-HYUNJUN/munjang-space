import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import styled from "styled-components";

const StyledSwitch = styled.div`
  margin-top: 15px;
  display: flex;
  justify-content: center;
`;

const Auth = () => {
  const [login, setLogin] = useState(false);

  const handleLogin = () => setLogin(true);
  const handleSignUp = () => setLogin(false);
  return (
    <div>
      {login ? <Login /> : <SignUp />}
      <StyledSwitch>
        <span onClick={handleLogin}>로그인</span>
        <span>|</span>
        <span onClick={handleSignUp}>회원가입</span>
      </StyledSwitch>
    </div>
  );
};

export default Auth;
