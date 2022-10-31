import React, { useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import Codersgateway from "../components/AuthPages/Coders-gate-way";
import NavBar from "../components/NavBar/NavBar";
import toast, { Toaster } from "react-hot-toast";
import CreateNewServer from "../models/CreateNewServer";
import SideBar from "../components/Sidebar/SideBar";
import { logout } from "../libs/auth";
import { userDetails, getMessages } from "../libs/chats";
import {
  getUsersServer,
  getServerDetailsById,
  getServerChatByServerId,
} from "../libs/server";
import {
  UserDataContext,
  ServerDataContext,
  SocketTransferData,
} from "../Context/ContextProvide";
import { io } from "socket.io-client";
import SearchUser from "../models/SearchUser";

let isCodeSync = false;

const handleRoutes = ["/app/friends", "/app/channel/c", "/app/profile"];

const MainLayout = ({ children }: any) => {
  const [login, setLogin] = useState<any>(false);
  const [open, setOpen] = useState<any>(false);
  const [openModel, setOpenModel] = React.useState<any>(false);
  const [call, setCall] = React.useState<any>(false);
  const [checkUsername, setCheckUsername] = React.useState<any>(false);
  const { userData, setUserData } = useContext(UserDataContext);
  const [recieveChat, setRecieveChart] = useState<any>([]);
  const [userID, setUserID] = useState<any>(null);

  const {
    serversData,
    setServersData,
    pendingRequests,
    setPendingRequests,
    editorData,
    setEditorData,
    messagesData,
    setMessagesData,
    input,
    setOutput,
    setSideBarServers,
    sideBarServers,
    setFriends,
    setSendRequests,
    chats,
    setChats,
    chatId,
    searchUserModel,
    setSearchUserModel,
    serverChat,
    setServerChat,
  } = useContext(ServerDataContext);

  const { chatMessageSocket, setChatMessageSocket, serverChatMessageSocket } =
    useContext(SocketTransferData);

  const chatSocket = useRef<any>(null);
  const serverSocket = useRef<any>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  const handleLogin = () => {
    setLogin(true);
  };

  const handleRegister = () => {
    setLogin(false);
  };

  const handleModelOpen = () => {
    setOpenModel(true);
  };

  const handleModelClose = () => {
    setOpenModel(false);
  };

  const router = useRouter();

  const { query } = router;

  React.useEffect(() => {
    console.log("call");
    if (query?.login === "") {
      handleLogin();
      handleOpen();
    }
    if (query?.register === "") {
      handleRegister();
      handleOpen();
    }
  }, [query && router.isReady]);

  const setFriendsData = (friendsData: any) => {
    const acceptedFriends = friendsData.map(
      (friend: any) => friend.isAccept === true
    );
    const pendingFriends = friendsData.map(
      (friend: any) => friend.isAccept === false && friend.isReq === true
    );
    const sentFriends = friendsData.map(
      (friend: any) => friend.isAccept === false && friend.isReq === false
    );
    setFriends(acceptedFriends);
    setSendRequests(sentFriends);
    setPendingRequests(pendingFriends);
  };

  const getServerDataById = async (id: string) => {
    const { data } = await getServerDetailsById(id);
    if (data) {
      setServersData(data);
    }
    return data;
  };

  const getSideBarServers = async () => {
    const { data }: any = await getUsersServer();
    if (data) {
      setSideBarServers(data);
      setCall(false);
    }
  };

  const getUserData = async () => {
    const { data }: any = await userDetails();
    if (data.status === "Ok") {
      const { email, name, username, id, uid, chats, friends, servers } =
        data.data;
      setUserData({ email, name, username, id, uid });
      if (username.length <= 20) {
        setSideBarServers(servers);
        setFriendsData(friends);
        setChats(chats);
      }
    } else {
      setUserData([]);
      toast.error("Something went wrong");
      await logout();
    }
  };

  const handleLogOut = () => {
    const init = async () => {
      const data = await logout();
      if (data.message) {
        router.push("/");
        toast.success(data.message);
        setUserData([]);
        setChats([]);
        setFriends([]);
        setSendRequests([]);
        setPendingRequests([]);
        setSideBarServers([]);
        setEditorData("");
        setMessagesData([]);
        setChatMessageSocket([]);
      }
    };
    init();
  };

  React.useEffect(() => {
    if (handleRoutes.includes(router.pathname) && userData.length === 0) {
      getUserData();

      chatSocket.current = io("ws://localhost:9739");
      chatSocket.current?.on("getMessage", (data: any) => {
        const { data: transferData } = data;
        setRecieveChart(transferData);
      });
      chatSocket.current?.on("getRequest", (data: any) => {
        const { data: ret } = data;
        console.log(ret);
      });

      serverSocket.current = io("ws://localhost:5000");
      serverSocket.current?.on("roomUsers", (data: any) => {
        console.log(data);
        if (isCodeSync) {
          serverSocket.current?.emit("syncCode", editorData);
        }
        isCodeSync = false;
        serverSocket.current?.on("syncCode", (data: any) => {
          if (!isCodeSync) {
            setEditorData(data);
            isCodeSync = true;
          }
        });
      });

      serverSocket.current?.on("codeShare", (data: any) => {
        setEditorData(data);
      });

      serverSocket.current?.on("message", (data: any) => {
        // console.log(data);
        const { data: ret } = data;
        console.log(ret);
        setServerChat((prev: any) => {
          const prevChat = prev.users;
          const newChat = [...prevChat, ret];
          return { ...prev, users: newChat };
        });
      });
    }
  }, [router.pathname === "/app"]);

  React.useEffect(() => {
    const init = async () => {
      const { data }: any = await getServerChatByServerId(
        serversData?.serverId
      );
      if (data) {
        const { chatId, users } = data;
        console.log({ chatId, users });
        setServerChat({ chatId, users });
      }
    };
    if (serversData.length !== 0 && serverChat.length === 0) {
      init();
    }
    console.log(serversData, serverChat);
  }, [serversData]);

  React.useEffect(() => {
    const init = async () => {
      const data = await getServerDataById(sideBarServers[0]?.serverId);
      setServersData(data);
      const SID = data.serverId;
      serverSocket.current?.emit("joinRoom", {
        serverId: SID,
        id: userData.id,
        userName: userData.username,
        profileImage: userData.profileImage,
      });
    };

    if (sideBarServers.length !== 0) {
      init();
    }
  }, [sideBarServers]);

  React.useEffect(() => {
    if (call) {
      getSideBarServers();
    }
  }, [call]);

  React.useEffect(() => {
    if (chats.length > 0 && messagesData.length === 0) {
      chats.map((chat: any) => {
        const init = async () => {
          const { data }: any = await getMessages(chat.chatId);
          if (data.data.status === "Ok") {
            const { chatId, users } = data.data.data;
            setMessagesData((prev: any) => [...prev, { chatId, users }]);
          }
        };
        init();
      });
    }
  }, [chats]);

  React.useEffect(() => {
    if (userData.length !== 0) {
      const data = userData?.id;
      setUserID(data);
      console.log(userData);
      const checkUName = (userData?.username).length; // check if username is set or not
      if (checkUName <= 20) {
        setCheckUsername(true);
      }
      chatSocket.current?.emit("login", data);
    }
  }, [userData]);

  React.useEffect(() => {
    if (chatMessageSocket.length !== 0) {
      chatSocket.current?.emit("sendMessage", chatMessageSocket);
    }
  }, [chatMessageSocket]);

  React.useEffect(() => {
    if (recieveChat.length !== 0) {
      if (
        messagesData.filter(
          (message: any) => message.chatId === recieveChat.chatId
        ).length === 0
      ) {
        setCall(true);
      }
      setCall(false);
      setMessagesData((prev: any) => {
        const ret = prev.filter(
          (msg: any) => msg.chatId === recieveChat.chatId
        );
        const ret2 = prev.filter(
          (msg: any) => msg.chatId !== recieveChat.chatId
        );
        ret[0].users.push(recieveChat.data);
        return [...ret2, ...ret];
      });
    }
  }, [recieveChat]);

  React.useEffect(() => {
    serverSocket.current?.emit("chatMessage", serverChatMessageSocket);
  }, [serverChatMessageSocket]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      serverSocket.current?.emit("codeShare", editorData);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [editorData]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <main
        className={` bg-white flex w-screen h-screen ${
          !handleRoutes.includes(router.pathname)
            ? "flex-col gap-4"
            : "flex-row"
        }`}
      >
        {router.pathname === "/" && (
          <NavBar
            handleOpen={handleOpen}
            handleClose={handleClose}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            open={open}
          />
        )}
        {open && !handleRoutes.includes(router.pathname) && (
          <Codersgateway
            login={login}
            handleClose={handleClose}
            handleLogin={handleLogin}
          />
        )}
        {handleRoutes.includes(router.pathname) &&
          sideBarServers &&
          checkUsername && (
            <>
              <SideBar
                handleModelOpen={handleModelOpen}
                handleLogOut={handleLogOut}
              />
              {openModel && (
                <CreateNewServer
                  handleModelClose={handleModelClose}
                  setCall={setCall}
                  id={userData?.id}
                />
              )}
            </>
          )}
        {searchUserModel && (
          <SearchUser handleModelClose={setSearchUserModel} />
        )}
        {children}
      </main>
    </>
  );
};

export default MainLayout;
