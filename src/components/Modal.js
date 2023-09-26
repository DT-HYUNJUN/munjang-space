import styled from "styled-components";

const Modal = ({ content, setModal }) => {
  return (
    <Container>
      <CloseButton onClick={() => setModal(false)}>X</CloseButton>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Container>
  );
};

export default Modal;

const Container = styled.div`
  width: 300px;
  height: 200px;

  /* 최상단 위치 */
  z-index: 999;

  /* 중앙 배치 */
  /* top, bottom, left, right 는 브라우저 기준으로 작동한다. */
  /* translate는 본인의 크기 기준으로 작동한다. */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* 모달창 디자인 */
  border: 1px solid black;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
`;
