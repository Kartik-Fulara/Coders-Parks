// call the next api
import axios from "axios";

export const isToken = async () => {
  const { data } = await axios.get(`/api/isToken`);
  if (data.ans) {
    return true;
  }
  return false;
};
