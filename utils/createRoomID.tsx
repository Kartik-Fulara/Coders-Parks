import { v4 as uuidv4 } from "uuid";

const createRoomID = () => {
  return uuidv4();
};

export default createRoomID;
