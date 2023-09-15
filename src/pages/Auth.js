import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

const Auth = () => {
  const [login, setLogin] = useState(false);

  const handleLogin = () => setLogin(true);
  const handleSignUp = () => setLogin(false);
  return (
    <div>
      {login ? <Login /> : <SignUp />}
      <button onClick={handleLogin}>로그인</button>
      <button onClick={handleSignUp}>회원가입</button>
    </div>
  );
};

export default Auth;
