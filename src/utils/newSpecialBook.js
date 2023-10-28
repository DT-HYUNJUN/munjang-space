import axios from "axios";

const newSpecialBook = async () => {
  const key = "ttbangle3071358001";
  const res = await axios.get(`/ttb/api/ItemList.aspx?ttbkey=${key}&QueryType=ItemNewSpecial&Cover=Big&MaxResults=10&start=1&SearchTarget=Book&output=js&Version=20131101`);
  return res.data.item;
};

export default newSpecialBook;
