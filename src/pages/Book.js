import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const Book = () => {
  const { isbn13 } = useParams();

  return (
    <div>
      <div>
        <p>책 제목</p>
        <p>작가 이름</p>
        <button>종이책 구매</button>
      </div>

      <div>
        <h1>책소개</h1>
        <hr />
        <p>책 내용</p>
      </div>

      <div>
        <h1>이 책의 독후감</h1>
        <hr />
        <div>
          <p>독후감제목</p>
          <p>유저이름</p>
        </div>
      </div>
    </div>
  );
};

export default Book;
