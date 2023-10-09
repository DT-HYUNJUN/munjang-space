import axios from "axios";

const getBooks = async (inputTitle) => {
  const key = "ttbangle3071358001";
  const res = await axios.get(`/ttb/api/ItemSearch.aspx?TTBKey=${key}&Query=${inputTitle}&Cover=Big&output=JS&Version=20131101`);
  return res.data.item;
};

export default getBooks;
