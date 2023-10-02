import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Modal = ({ setModal }) => {
  const key = "ttbangle3071358001";

  const [bookData, setBookdata] = useState([]);

  const [inputTitle, setInputTitle] = useState("");

  const closeModal = () => {
    setModal(false);
  };

  const printInput = () => {
    const inputSave = document.getElementById("searchTitle").value;
    setInputTitle(inputSave);
  };

  const hueji = (e) => {
    e.preventDefault();
    axios.get(`/ttb/api/ItemSearch.aspx?TTBKey=${key}&Query=${inputTitle}&output=JS&Version=20131101`).then((res) => {
      setBookdata(res.data.item);
    });
  };

  return (
    <Container>
      <CloseButton onClick={closeModal}>X</CloseButton>
      <FormWrapper onSubmit={hueji}>
        <input type="text" id="searchTitle" onChange={printInput} />
        <button type="submit">입력</button>
      </FormWrapper>

      {bookData.map((it) => (
        <div key={it.isbn}>
          <p>{it.title}</p>
          <p>{it.author}</p>
          <hr></hr>
        </div>
      ))}
    </Container>
  );
};

export default Modal;

const Container = styled.div`
  width: 1000px;
  height: 760px;

  z-index: 999;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: 8px;

  background-color: #e2e2e2;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.35);
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const FormWrapper = styled.form`
  display: flex;
  justify-content: center;
`;
