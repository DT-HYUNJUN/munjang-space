import axios from "axios";

const newSpecialBook = async () => {
  // const proxy = "https://port-0-munjang-space-proxy-server-17xqnr2algn95l6h.sel3.cloudtype.app";
  const proxy = "https://hlfoatnips.us14.qoddiapp.com";
  const res = await axios.get(`${proxy}/newSpecialBook`);
  return res.data;
};

export default newSpecialBook;
