import axios, { AxiosResponse } from "axios";
import { IBook } from "../types";

const listBooks = async (): Promise<IBook[]> => {
  // const proxy = "https://port-0-munjang-space-proxy-server-17xqnr2algn95l6h.sel3.cloudtype.app";
  const proxy = "https://hlfoatnips.us14.qoddiapp.com";
  try {
    const res: AxiosResponse<IBook[]> = await axios.get(`${proxy}/listBooks`);
    return res.data;
  } catch (error) {
    console.log("ListBooks API Error", error);
    throw error;
  }
};

export default listBooks;
