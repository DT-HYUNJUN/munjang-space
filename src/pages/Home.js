import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import listBooks from "../utils/listBooks";

import styled from "styled-components";

const Home = () => {
  const [bestsellerBook, setBestSellerBook] = useState([]);

  useEffect(() => {
    try {
      listBooks().then((res) => setBestSellerBook(res));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const navigate = useNavigate();

  const clickBestSellerBook = (isbn13) => {
    navigate(`/book/${isbn13}`);
  };

  return (
    <BestSeller>
      {bestsellerBook.map((item) => (
        <div key={item.isbn} onClick={() => clickBestSellerBook(item.isbn13)}>
          <img src={item.cover} alt={item.title} />
          <p>{item.title}</p>
        </div>
      ))}
    </BestSeller>
  );
};

export default Home;

const BestSeller = styled.div`
  display: flex;
  cursor: pointer;
`;
