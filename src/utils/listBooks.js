import axios from "axios";

const listBooks = async () => {
  const proxy = "https://port-0-munjang-space-proxy-server-17xqnr2algn95l6h.sel3.cloudtype.app";
  const res = await axios.get(`${proxy}/listBooks`);
  return res.data;
};

export default listBooks;
