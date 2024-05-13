import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const Loading = () => {
  return (
    <LoadingWrapper>
      <FontAwesomeIcon icon={faBook} beatFade size="3x" />
    </LoadingWrapper>
  );
};

export default Loading;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
