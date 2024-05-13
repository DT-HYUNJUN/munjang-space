import { useEffect, useState } from "react";
import listBooks from "../utils/listBooks";
import newSpecialBook from "../utils/newSpecialBook";
import getLikeReports from "../utils/getLikeReports";
import { IBook, IReport } from "../types";
import BestSeller from "../components/Home/BestSeller";
import BestLikes from "../components/Home/BestLikes";
import SpecialBooks from "../components/Home/SpecialBooks";
import SearchInput from "../components/Home/SearchInput";
import CreateButton from "../components/Home/CreateButton";
import Loading from "../components/Global/Loading";

const Home = () => {
  const [bestsellerBooks, setBestSellerBook] = useState<IBook[]>([] as IBook[]);
  const [bsLoading, setBsLoading] = useState(false);

  const [specialBooks, setSpecialBook] = useState<IBook[]>([] as IBook[]);
  const [spLoading, setSpLoading] = useState(false);

  const [likeReports, setLikeReports] = useState<IReport[]>([] as IReport[]);
  const [lrLoading, setLrLoading] = useState(false);

  const handleClickLikeReports = () => {
    getLikeReports().then((res) => setLikeReports(res.sort((a, b) => b.like - a.like).slice(0, 10)));
  };

  const getBsBooks = async () => {
    const book = await listBooks();
    setBestSellerBook(book);
    setBsLoading(true);
  };

  const getSpBooks = async () => {
    const book = await newSpecialBook();
    setSpecialBook(book);
    setSpLoading(true);
  };

  const getLkBooks = async () => {
    const book = await getLikeReports();
    const sortedBook = book.sort((a, b) => b.like - a.like).slice(0, 10);
    setLikeReports(sortedBook);
    setLrLoading(true);
  };

  useEffect(() => {
    try {
      getLkBooks();
      getBsBooks();
      getSpBooks();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return bsLoading && lrLoading && spLoading ? (
    <div>
      <CreateButton />
      <SearchInput />
      <BestSeller bestsellerBooks={bestsellerBooks} />
      <BestLikes likeReports={likeReports} handleClickLikeReports={handleClickLikeReports} />
      <SpecialBooks specialBooks={specialBooks} />
    </div>
  ) : (
    <div>
      <Loading />
    </div>
  );
};

export default Home;
