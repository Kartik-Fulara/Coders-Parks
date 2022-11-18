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

export const changeUserName = async (username: string, pass:string) => {
  try {
    const res = await axios.post(`/api/chat/changeUserName`, { username,pass });
    console.log(res);
    return res.data.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getMessages = async (id: string) => {
  const res = await axios.get(`/api/chat/getChat?chatId=${id}`);
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

export const acceptFriend = async (data: any) => {
  const friendId = data.friendId;

  try {
    const res = await axios.put(`/api/chat/acceptFriend?friendId=${friendId}`);
    console.log(res);
    return { status: "ok", data: res.data.data };
  } catch (err) {
    console.log(err);
    return { status: "error" };
  }
};

export const rejectFriend = async (data: any) => {
  let friendId;
  if (typeof data === "string") {
    friendId = data;
  } else {
    friendId = data.friendId;
  }
  // console.log(friendId);
  try {
    const res = await axios.delete(`/api/chat/deleteReq?friendId=${friendId}`);
    return { status: "ok", data: res.data.data };
  } catch (err) {
    console.log(err);
    return { status: "error" };
  }
};

export const removeFriend = async (data: any) => {
  let friendId;
  if (typeof data === "string") {
    friendId = data;
  } else {
    friendId = data.friendId;
  }
  try {
    const res = await axios.delete(
      `/api/chat/removeFriend?friendId=${friendId}`
    );
    return { status: "ok", data: res.data.data };
  } catch (err) {
    console.log(err);
    return { status: "error" };
  }
};

export const declineReq = async (data: any) => {
  let friendId;
  if (typeof data === "string") {
    friendId = data;
  } else {
    friendId = data.friendId;
  }
  // console.log(friendId);
  try {
    const res = await axios.delete(
      `/api/chat/rejectFriend?friendId=${friendId}`
    );
    return { status: "ok", data: res.data.data };
  } catch (err) {
    console.log(err);
    return { status: "error" };
  }
};

export const getUserChat = async () => {
  try {
    const res = await axios.get(`/api/chat/getUserChat`);
    return res.data.data.data;
  } catch (err: any) {
    console.log(err);
    return null;
  }
};
