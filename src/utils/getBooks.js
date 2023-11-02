import axios from "axios";

// const getBooks = async (inputTitle) => {
//   const key = "ttbangle3071358001";
//   const res = await axios.get(`/ttb/api/ItemSearch.aspx?TTBKey=${key}&Query=${inputTitle}&Cover=Big&output=JS&Version=20131101`);
//   return res.data.item;
// };

const getBooks = async (inputTitle) => {
  const proxy = "https://port-0-munjang-space-proxy-server-17xqnr2algn95l6h.sel3.cloudtype.app";
  const res = await axios.get(`${proxy}/getBooks?title=${inputTitle}`);
  return res.data;
};

export default getBooks;
