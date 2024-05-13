import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyButton from "../Global/MyButton";

const SearchInput = () => {
  const [bookName, setBookName] = useState("");
  const [inputClick, setInputClick] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookName(e.target.value);
  };

  return (
    <BookSearchWrapper>
      <BookSearchForm
        onSubmit={() =>
          navigate("/booksearch", {
            state: {
              bookName,
            },
          })
        }
      >
        <BookSearchInput
          type="text"
          value={bookName}
          onChange={handleInput}
          required
          onFocus={() => {
            setInputClick(true);
          }}
          onBlur={() => setInputClick(false)}
          placeholder={inputClick === true ? "" : "책 제목을 입력해주세요."}
        />
        <MyButton type={"positive"} text={"책 검색"} />
      </BookSearchForm>
    </BookSearchWrapper>
  );
};

export default SearchInput;

const BookSearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
`;

const BookSearchInput = styled.input`
  border: 1px solid #777;
  font-size: 24px;
  border-radius: 8px;
  width: 500px;

  font-family: "UhBeeJJIBBABBA";

  @media (max-width: 768px) {
    width: 100%;
    font-size: 12px;
  }
`;

const BookSearchForm = styled.form`
  display: flex;
  align-self: center;
  gap: 10px;
`;
