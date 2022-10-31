import axios from "axios";

export const getServerDetails = async () => {
  try {
    const response = await axios.get("/api/servers/getServerDetails");

    if (response.status === 200) {
      return response.data;
    }

    return { status: "error", message: response.data.message };
  } catch (err: any) {
    console.log(err);
    return null;
  }
};

export const createServer = async (
  id: string,
  username: string,
  image: string,
  serverName: string,
  serverImage: string
) => {
  if (!serverName) {
    return { status: "error", message: "Please enter the server name" };
  }
  if (!serverImage) {
    serverImage = "";
  }
  console.log(username);
  try {
    const response = await axios.post("/api/servers/createServer", {
      id,
      username,
      userProfileImage: image,
      serverName,
      serverImage,
    });
    console.log(response);
    return {
      status: "ok",
      data: response.data,
      message: "Server created successfully",
    };
  } catch (err: any) {
    console.log(err);
    return { status: "error", data: "No Data", message: err };
  }
};

export const getUsersServer = async () => {
  try {
    const { data } = await axios.get("/api/servers/getAllServers");
    console.log(data);
    return { status: "ok", data: data };
  } catch (err: any) {
    console.log(err);
    return { status: "error", data: "No Data", message: err };
  }
};

export const getServerDetailsById = async (id: string) => {
  try {
    const { data } = await axios.get(
      `/api/servers/getServerDetailsById?id=${id}`
    );
    console.log(data);
    return { status: "ok", data: data.server };
  } catch (err: any) {
    console.log(err);
    return { status: "error", data: "No Data", message: err };
  }
};

export const runCode = async (code: any, language: string, input: any) => {
  try {
    console.log(code, language, input);
    const { data } = await axios.post("/api/servers/runCode", {
      code,
      language,
      input,
    });
    console.log(data);
    return { status: "ok", data: data };
  } catch (err: any) {
    console.log(err);
    return { status: "error", data: "No Data", message: err };
  }
};

export const searchServer = async (link: any) => {
  try {
    const { data } = await axios.get(`/api/servers/searchServer?link=${link}`);
    console.log(data);
    return { status: "ok", data: data };
  } catch (err: any) {
    console.log(err);
    return { status: "error", data: "No Data", message: err };
  }
};

export const joinServer = async (
  serverId: string,
  serverName: string,
  serverImage: string,
  userAvatar: string,
  userName: string
) => {
  if (!serverImage) {
    serverImage = "";
  }
  try {
    const { data } = await axios.post("/api/servers/joinServer", {
      serverName,
      serverId,
      serverImage,
      userAvatar,
      userName,
    });
    console.log(data);
    return { status: "ok", data: data };
  } catch (err: any) {
    console.log(err);
    return { status: "error", data: "No Data", message: err };
  }
};

export const sendMessage = async (Suid: any, serverId: any, message: any) => {
  const res = await axios.post(`/api/servers/sendMessage`, {
    senderId: Suid,
    chatId: serverId,
    message: message,
  });

  console.log(res);

  return res.data;
};

export const getServerChatByServerId = async (serverId: any) => {
  try {
    const { data } = await axios.get(
      `/api/servers/getServerChatByServerId?serverId=${serverId}`
    );
    console.log(data);
    return { status: "ok", data: data.server };
  } catch (err: any) {
    console.log(err);
    return { status: "error", data: "No Data", message: err };
  }
};
