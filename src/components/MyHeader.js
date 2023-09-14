import { Link } from "react-router-dom";

const MyHeader = () => {
  return (
    <div className="Header">
      <div className="Logo">
        <img className="logoImg" src={process.env.PUBLIC_URL + "images/dog.png"} alt="logoImg" />
        <h2>문장의 공간</h2>
      </div>

      <div className="NavBar">
        <Link to={"/"}>Home</Link>
        <Link to={"/List"} style={{ textDecoration: "None" }}>
          나의 서재
        </Link>
        <Link to={"/Statistics"}>나의 통계</Link>
        <Link to={"/Profile"}>나의 정보</Link>
      </div>
    </div>
  );
};

export default MyHeader;
