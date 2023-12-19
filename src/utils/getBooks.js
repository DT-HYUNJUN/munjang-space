import axios from "axios";

const getBooks = async (inputTitle) => {
  // const proxy = "https://port-0-munjang-space-proxy-server-17xqnr2algn95l6h.sel3.cloudtype.app";
  const proxy = "http://hlfoatnips.us14.qoddiapp.com";
  const res = await axios.get(`${proxy}/getBooks?title=${inputTitle}`);
  return res.data;
};

export default getBooks;
