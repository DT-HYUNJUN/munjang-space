import styled from "styled-components";
import MyButton from "./MyButton";

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

const LoginForm = styled.div`
  display: grid;
  justify-content: center;
`;

const Logininput = styled.input`
  border: 1px solid gray;
  border-radius: 3px;

  background-color: #ececec;
  color: black;

  width: 400px;
  height: 40px;

  margin-bottom: 10px;
`;

const Login_1 = styled.div`
  display: grid;
`;

const Login = () => {
  return (
    <div>
      <div>
        <Title> 로그인 </Title>
        <Subtitle>문장의 공간과 함께 하세요.</Subtitle>
      </div>

      <LoginForm>
        <Login_1>
          <Logininput
            type="text"
            textarea
            name="userName"
            placeholder="Email"
          />
          <Logininput
            type="password"
            name="userPassword"
            placeholder="Password"
          />
        </Login_1>

        <label htmlFor="remember-check">
          <input type="checkbox" id="remember-check" /> 아이디 저장하기
        </label>

        <MyButton text={"로그인"} type={"positive"} onClick={onclick} />
      </LoginForm>
    </div>
  );
};

export default Login;
