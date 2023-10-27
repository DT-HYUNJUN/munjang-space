import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Statistics = ({ IsLogin }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!IsLogin) {
      navigate("/login");
      alert("로그인 해주세요!");
    }
  }, []);
  return <div></div>;
};

export default Statistics;
