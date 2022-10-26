// call the next api
import axios from "axios";

export const isToken = async () => {
  const res = await axios.get(`/api/isToken`);
  return res.data;
};
