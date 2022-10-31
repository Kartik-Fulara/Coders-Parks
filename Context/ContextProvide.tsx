// create a context provider
import React, { createContext } from "react";

export const ServerDataContext = createContext<any>([]);

export const UserDataContext = createContext<any>([]);

export const SocketTransferData = createContext<any>([]);

const ContextProvider = ({ children }: any) => {
  const [userData, setUserData] = React.useState<any>([]);
  const [sideBarServers, setSideBarServers] = React.useState<any>([]);
  const [serversData, setServersData] = React.useState<any>([]);
  const [serverChat, setServerChat] = React.useState<any>([]);
  const [pendingRequests, setPendingRequests] = React.useState<any>([]);
  const [sendRequests, setSendRequests] = React.useState<any>([]);
  const [friends, setFriends] = React.useState<any>([]);
  const [chats, setChats] = React.useState<any>([]);
  const [chatId, setChatId] = React.useState<any>("");
  const [editorData, setEditorData] = React.useState<any>("");
  const [messagesData, setMessagesData] = React.useState<any>([]);
  const [language, setLanguage] = React.useState<any>("");
  const [showWhichComponent, setShowWhichComponent] =
    React.useState<any>("chat");
  const [openConsole, setOpenConsole] = React.useState<any>(false);
  const [input, setInput] = React.useState<any>("");
  const [output, setOutput] = React.useState<any>("");
  const [chatMessageSocket, setChatMessageSocket] = React.useState<any>([]);
  const [serverChatMessageSocket, setServerChatMessageSocket] =
    React.useState<any>([]);
  const [searchUserModel, setSearchUserModel] = React.useState(false);
  const [selectedServerId, setSelectedServerId] = React.useState<any>("");

  const [openHolder, setOpenHolder] = React.useState<any>(false);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      <ServerDataContext.Provider
        value={{
          serversData,
          setServersData,
          pendingRequests,
          setPendingRequests,
          editorData,
          setEditorData,
          messagesData,
          setMessagesData,
          language,
          setLanguage,
          showWhichComponent,
          setShowWhichComponent,
          openConsole,
          setOpenConsole,
          input,
          setInput,
          output,
          setOutput,
          setSideBarServers,
          sideBarServers,
          friends,
          setFriends,
          sendRequests,
          setSendRequests,
          chats,
          setChats,
          chatId,
          setChatId,
          serverChat,
          setServerChat,
          selectedServerId,
          setSelectedServerId,
          searchUserModel,
          setSearchUserModel,
          openHolder,
          setOpenHolder,
        }}
      >
        <SocketTransferData.Provider
          value={{
            chatMessageSocket,
            setChatMessageSocket,
            serverChatMessageSocket,
            setServerChatMessageSocket,
          }}
        >
          {children}
        </SocketTransferData.Provider>
      </ServerDataContext.Provider>
    </UserDataContext.Provider>
  );
};

export default ContextProvider;
