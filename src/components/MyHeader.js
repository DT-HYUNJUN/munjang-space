import { NavLink } from "react-router-dom";


const MyHeader = () => {
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
        <NavLink to="/List">나의 서재</NavLink>
        <NavLink to="/Statistics">나의 통계</NavLink>
        <NavLink to="/Profile">나의 정보</NavLink>
      </div>
    </div>
  );
};

export default MyHeader;
