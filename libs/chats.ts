// get al chats with the help of uid
import axios from "axios";

export const userDetails = async (token = "") => {
  if (token !== undefined) {
    const res = await axios.get(`/api/chat/userDetails?token=${token}`);
    return res.data;
  } else {
    return undefined;
  }
};

export const queryUserById = async (id: string) => {
  const res = await axios.get(`/api/chat/queryUserById?id=${id}`);
  return res;
};

export const queryUserByUserName = async (username: string) => {
  const res = await axios.get(
    `/api/chat/queryUserByUserName?username=${username}`
  );
  return res;
};

export const changeUserName = async (username: string) => {
  const res = await axios.post(`/api/chat/changeUserName`, { username });
  return res;
};

export const getMessages = async (id: string) => {
  console.log(id);
  const res = await axios.get(`/api/chat/getChats?uid=${id}`);
  return res;
};

export const getChats = async (chatid: string) => {
  const res = await axios.get(`/api/chat/getChat?chatId=${chatid}`);
  return res;
};

export const sendMessage = async (Suid: any, chatId: any, message: any) => {
  const res = await axios.post(`/api/chat/sendMessage`, {
    senderId: Suid,
    chatId: chatId,
    message: message,
  });

  console.log(res);

  return res.data;
};

export const startChat = async (friendId: any) => {
  try {
    const res = await axios.post(`/api/chat/startChat`, {
      friendId: friendId,
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const addFriends = async (friendsId: any) => {
  try {
    const res = await axios.post(`/api/chat/addFriends?friendId=${friendsId}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getFriends = async (token: any) => {
  try {
    const res = await axios.get(`/api/chat/getFriends?token=${token}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getPendingFriends = async (token: any) => {
  try {
    const res = await axios.get(`/api/chat/getPendingFriends?token=${token}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
