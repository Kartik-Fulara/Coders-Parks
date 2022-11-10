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
import { isToken } from "../libs/isToken";
import BottomBar from "../components/BottomBar/BottomBar";

const handleRoutes = ["/app/friends", "/app/channel/c", "/app/profile"];

const MainLayout = ({ children }: any) => {
  const [login, setLogin] = useState<any>(false);
  const [open, setOpen] = useState<any>(false);
  const [openModel, setOpenModel] = React.useState<any>(false);
  const [call, setCall] = React.useState<any>(false);
  const [checkUsername, setCheckUsername] = React.useState<any>(false);
  const [recieveChat, setRecieveChart] = useState<any>([]);
  const [isCodeSync, setIsCodeSync] = useState<any>(false);
  const [loading, setLoading] = useState<any>(true);

  const { loadingText, setLoadingText, userData, setUserData } =
    useContext(UserDataContext);
  const {
    serversData,
    setServersData,
    setPendingRequests,
    editorData,
    setEditorData,
    messagesData,
    setMessagesData,
    input,
    setOutput,
    output,
    setInput,
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
    currentHost,
    setCurrentHost,
    setLogoutLoading,
    friends,
    pendingRequests,
    sendRequests,
    language,
    setLanguage,
  } = useContext(ServerDataContext);

  const {
    chatMessageSocket,
    setChatMessageSocket,
    serverChatMessageSocket,
    requestSocket,
  } = useContext(SocketTransferData);

  const chatSocket = useRef<any>(null);
  const serverSocket = useRef<any>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    router.push("/");
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
    if (query?.login === "") {
      setLogin(true);
      handleOpen();
    }
    if (query?.register === "") {
      handleRegister();
      handleOpen();
    }
  }, [query && router.isReady]);

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

  const setFriendsData = (friendsData: any) => {
    // console.log(friendsData);
    const acceptedFriends = friendsData.filter(
      (friend: any) => friend.isAccept === true
    );
    const pendingFriends = friendsData.filter(
      (friend: any) => friend.isAccept === false && friend.isReq === false
    );
    const sentFriends = friendsData.filter(
      (friend: any) => friend.isAccept === false && friend.isReq === true
    );

    // console.log(acceptedFriends, pendingFriends, sentFriends);

    if (acceptedFriends.length !== 0) {
      // console.log("Accepted Req");

      if (friends.length === 0) {
        setFriends(acceptedFriends);
      } else {
        const newFriends = [...friends, ...acceptedFriends];
        setFriends(newFriends);
      }
    }
    if (pendingFriends.length !== 0) {
      // console.log("Pending Req");
      if (pendingRequests.length === 0) {
        setPendingRequests(pendingFriends);
      } else {
        const newPendingFriends = [...pendingRequests, ...pendingFriends];
        setPendingRequests(newPendingFriends);
      }
    }
    if (sentFriends.length !== 0) {
      // console.log("Send Req");
      // console.log(sendRequests);
      if (sendRequests.length === 0) {
        setSendRequests(sentFriends);
      } else {
        const newSentFriends = [...sendRequests, ...sentFriends];
        setSendRequests(newSentFriends);
      }
    }
  };

  const getUserData = async () => {
    setLoadingText("fetching user details");
    const { data }: any = await userDetails();

    if (data?.status === "Ok") {
      const { email, name, username, id, uid, chats, friends, servers } =
        data.data;

      setUserData({ email, name, username, id, uid });
      if (username.length <= 20) {
        setSideBarServers(servers);
        setFriendsData(friends);
        setChats(chats);
        setLoading(true);
      } else {
        setLoading(false);
      }
    } else {
      const data = await logout();
      router.push("/");
      setLoading(false);
      setUserData([]);

      toast.error("Something went wrong Please login again");
    }
  };

  const handleLogOut = (msg = ""): void => {
    const init = async () => {
      setLogoutLoading(true);
      const data = await logout();
      if (data.message) {
        router.push("/?login");
        msg === "" ? toast.success(data.message) : toast.success(msg);
        setUserData([]);
        setChats([]);
        setFriends([]);
        setSendRequests([]);
        setPendingRequests([]);
        setSideBarServers([]);
        setEditorData("");
        setMessagesData([]);
        setChatMessageSocket([]);
        setCheckUsername(false);
        setLoading(true);
        setLogin(false);
        setLoadingText("Loading...");
        setLogoutLoading(false);
      }
    };
    init();
  };

  React.useEffect(() => {
    const init = async () => {
      const isTokenVerify = await isToken();
      if (handleRoutes.includes(router.pathname) && isTokenVerify) {
        setLoading(true);
        getUserData();

        chatSocket.current = io("wss://chat-coders-park-socket.glitch.me");

        chatSocket.current.on("login", (data: any) => {
          // console.log(data);
        });

        chatSocket.current.on("logout", (data: any) => {
          // console.log(data);
        });

        chatSocket.current?.on("getMessage", (data: any) => {
          const { data: transferData } = data;
          setRecieveChart(transferData);
        });
        chatSocket.current?.on("getRequest", (data: any) => {
          const { reqData: ret } = data;
          console.log(ret);
          if (ret !== undefined) {
            setFriendsData([ret]);
          }
        });

        serverSocket.current = io(`wss://channel-socket-coders-park.glitch.me`);

        serverSocket.current?.on("roomUsers", (data: any) => {
          // console.log(data);
          serverSocket.current?.emit("syncCode", editorData);
          serverSocket.current?.on("syncCode", (data: any) => {
            if (!isCodeSync) {
              setEditorData(data);
              setIsCodeSync(true);
            }
          });
        });

        serverSocket.current?.on("shareOutput", (data: any) => {
          // console.log(data);
          setOutput(data);
        });

        serverSocket.current?.on("shareInput", (data: any) => {
          // console.log(data);
          setInput(data);
        });

        serverSocket.current?.on("shareLanguage", (data: any) => {
          // console.log(data);
          setLanguage(data);
        });

        serverSocket.current?.on("changeHost", (data: any) => {
          setCurrentHost(data);
        });

        serverSocket.current?.on("codeShare", (data: any) => {
          if (userData?.id !== currentHost) {
            // console.log(data);
            setEditorData(data);
          } else {
            // console.log(data);
          }
        });

        serverSocket.current?.on("message", (data: any) => {
          const { data: ret } = data;

          setServerChat((prev: any) => {
            const prevChat = prev.users;
            const newChat = [...prevChat, ret];
            return { ...prev, users: newChat };
          });
        });
      } else if (handleRoutes.includes(router.pathname) && !isTokenVerify) {
        handleLogOut("Something went wrong login again please!!");
      }
    };

    init();
  }, [router.pathname.split("/")[1] === "app" && router.isReady]);

  React.useEffect(() => {
    if (userData.length !== 0) {
      const data = userData?.id;

      const checkUName = (userData?.username).length; // check if username is set or not
      if (checkUName <= 20) {
        setLoading(false);
        setCheckUsername(true);
      } else {
        setLoading(false);
      }
      chatSocket.current?.emit("login", data);
    }
  }, [userData]);

  React.useEffect(() => {
    const init = async () => {
      setLoadingText("fetching server data");
      const data = await getServerDataById(sideBarServers[0]?.serverId);
      if (data.length !== 0) {
        setServersData(data);
        const SID = data.serverId;
        setCurrentHost(data?.currentHost);
        // console.log(SID, userData.id, userData.username);
        serverSocket.current?.emit("joinRoom", {
          serverId: SID,
          id: userData.id,
          userName: userData.username,
          profileImage: userData.profileImage,
        });
        setLoading(false);
      }
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
    const init = async () => {
      const { data }: any = await getServerChatByServerId(
        serversData?.serverId
      );
      if (data) {
        const { chatId, users } = data;

        setServerChat({ chatId, users });
      }
    };
    if (serversData.length !== 0 && serverChat.length === 0) {
      init();
    }
  }, [serversData]);

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
        if (ret.length > 0) {
          ret[0].users.push(recieveChat.data);
        } else {
          ret2.push({ chatId: chatId, users: [recieveChat.data] });
          return ret2;
        }
        return [...ret2, ...ret];
      });
    }
  }, [recieveChat]);

  React.useEffect(() => {
    serverSocket.current?.emit("chatMessage", serverChatMessageSocket);
  }, [serverChatMessageSocket]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (userData?.id === currentHost) {
        serverSocket.current?.emit("codeShare", editorData);
      } else {
        // console.log(editorData);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [editorData]);

  React.useEffect(() => {
    // send output to socket
    const timeout = setTimeout(() => {
      serverSocket.current?.emit("shareOutput", output);
    }, 500);

    return () => clearTimeout(timeout);
  }, [output]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      serverSocket.current?.emit("shareInput", input);
    }, 500);

    return () => clearTimeout(timeout);
  }, [input]);

  React.useEffect(() => {
    serverSocket.current?.emit("changeHost", {
      host: currentHost,
      serverId: serversData?.id,
    });
  }, [currentHost]);

  React.useEffect(() => {
    if (requestSocket.length !== 0) {
      chatSocket.current?.emit("sendRequest", requestSocket);
    }
  }, [requestSocket]);

  React.useEffect(() => {
    serverSocket.current?.emit("shareLanguage", language);
  }, [language]);

  React.useEffect(() => {
    console.log("send", sendRequests);
  }, [sendRequests]);

  React.useEffect(() => {
    console.log("recieve", pendingRequests);
  }, [pendingRequests]);

  const LoadingFunction = () => {
    return (
      <div className="flex justify-center items-center h-full w-full relative bg-black4">
        <div className="text-white">{loadingText}</div>
        <div className="animate-spin rounded-full h-48 w-48 border-t-2 border-b-2 border-green-500 absolute"></div>
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <main
        className={` bg-white overflow-hidden flex w-screen h-screen ${
          !handleRoutes.includes(router.pathname)
            ? "flex-col gap-4"
            : "flex-col md:flex-row"
        }`}
      >
        {loading && router.pathname !== "/" && <LoadingFunction />}
        {router.pathname === "/" && (
          <NavBar
            handleOpen={handleOpen}
            handleClose={handleClose}
            handleLogin={setLogin}
            handleRegister={handleRegister}
            open={open}
          />
        )}
        {open && !handleRoutes.includes(router.pathname) && (
          <Codersgateway login={login} handleLogin={setLogin} />
        )}
        {!loading && (
          <>
            {handleRoutes.includes(router.pathname) && checkUsername && (
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
            {userData !== 0 && <>{children}</>}
            <BottomBar
              handleModelOpen={handleModelOpen}
              handleLogOut={handleLogOut}
            />
          </>
        )}
        {router.pathname === "/" && <>{children}</>}
      </main>
    </>
  );
};

export default MainLayout;
