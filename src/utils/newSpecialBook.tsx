import axios, { AxiosResponse } from "axios";
import { IBooks } from "../types";

const newSpecialBook = async (): Promise<IBooks[]> => {
  // const proxy = "https://port-0-munjang-space-proxy-server-17xqnr2algn95l6h.sel3.cloudtype.app";
  const proxy = "https://hlfoatnips.us14.qoddiapp.com";
  try {
    const res: AxiosResponse<IBooks[]> = await axios.get(`${proxy}/newSpecialBook`);
    return res.data;
  } catch (error) {
    console.log("NewSpecialBook API Error", error);
    throw error;
  }
};

export default newSpecialBook;
