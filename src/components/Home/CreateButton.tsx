import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const CreateButton = () => {
  const navigate = useNavigate();

  const handleClickNew = () => {
    navigate("/new");
  };

  return (
    <CreateButtonWrapper onClick={handleClickNew}>
      <FontAwesomeIcon icon={faPenFancy} /> 독후감 작성하기
    </CreateButtonWrapper>
  );
};

export default CreateButton;

const CreateButtonWrapper = styled.div`
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: 0.5s;
  opacity: 0.85;
  z-index: 10;
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  background-color: #a7d7e8;
  color: white;
  white-space: nowrap;
  font-family: "UhBeeJJIBBABBA";
  font-size: 18px;
  padding: 10px 15px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  &:hover {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.2, 1.2);
    transition: 0.5s;
    background-color: #79cbe9;
    color: white;
    opacity: 1;
  }
`;
