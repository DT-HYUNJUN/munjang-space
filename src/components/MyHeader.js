import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { authService } from "../fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MyHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    });
  }, []);
  return (
    <div className="Header">
      <div className="LeftHeader">
        <NavLink to="/">
          <div className="Logo">
            <img className="logoImg" src={process.env.PUBLIC_URL + "images/dog.png"} alt="logoImg" />
            <h2>문장의 공간</h2>
          </div>
        </NavLink>
      </div>

      <div className="NavBar">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/list">나의 서재</NavLink>
        <NavLink to="/statistics">나의 통계</NavLink>
        <NavLink to="/profile">{isLoggedIn ? "나의 정보" : "로그인"}</NavLink>
        {isLoggedIn ? <NavLink to="/profile">나의 정보</NavLink> : <NavLink to="/auth">로그인</NavLink>}
      </div>
    </div>
  );
};

export default MyHeader;
