// call the next api
import axios from "axios";

export const isToken = async () => {
  try {
    const { data } = await axios.get(`/api/isToken`);
    if (data.ans) {
      return true;
    } else {
      return false;
    }
  } catch (err: any) {
    console.log(err);
    return false;
  }
};
