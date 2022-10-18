import React, { useEffect, useRef } from "react";
import Avatar from "react-avatar";
import { SendIcon } from "../../../Icons/Icons";
import { useRouter } from "next/router";
import { getMessages, getChats, userDetails } from "../../../libs/chats";
import { queryUserById, sendMessage } from "../../../libs/chats";
import { format } from "timeago.js";

const DmsComponent = ({ uid, token, setSendMsg, recieveMsg }: any) => {
  const router = useRouter();

  const [chatId, setChatId] = React.useState("");

  const [isError, setIsError] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState<any>([]);
  const [otherUser, setOtherUser] = React.useState<any>([]);

  const [chats, setChats] = React.useState<any>([]);

  const [message, setMessage] = React.useState("");

  const scroll = useRef<any>();

  useEffect(() => {
    const getChatsData = async () => {
      const { data }: any = await getMessages(uid as string);
      console.log(data);

      const currentChat = data.data.data;
      const ret = currentChat.filter((item: any) => {
        return item.users[0] === uid;
      });
      console.log(router.query?.id);
      console.log(ret[0]);
      setChatId(ret[0]?.chatId);
    };

    if (uid !== null) {
      getChatsData();
    }
  }, [uid && router.isReady]);

  useEffect(() => {
    const init = async () => {
      const { data } = await getChats(chatId);
      setChats(data.data.data);
      if (data.data?.status === "Error") {
        setIsError(true);
      } else if (data.data?.status === "Ok") {
        setIsError(false);
      }
      const { data: user } = await userDetails(token);
      const { data: other } = await queryUserById(router.query?.id as string);
      const CurrentUser = {
        id: user.data.id,
        name: user.data.name,
        email: user.data.email,
        username: user.data.username,
        uid: user.data.uid,
      };
      setCurrentUser(CurrentUser);
      setOtherUser(other.data.data);
    };

    init();
  }, [chatId && router.isReady]);

  useEffect(() => {
    if (
      recieveMsg !== null &&
      router.query?.id === recieveMsg?.senderId &&
      chats.length > 0
    ) {
      setChats([...chats, recieveMsg]);
    } else if (
      recieveMsg !== null &&
      router.query?.id === recieveMsg?.senderId &&
      chats.length === 0
    ) {
      setChats([recieveMsg]);
    }
  }, [recieveMsg]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const init = async () => {
      const { data } = await sendMessage(currentUser.uid, chatId, message);
      if (data.status === "Ok") {
        setChats([...chats, data.data.data]);
      }
      const receiverId = otherUser.id;
      setSendMsg({ ...data.data.data, receiverId });
    };
    init();
    setMessage("");
  };

  // always scroll to the bottom
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <>
      {isError ? (
        <DmsErrorPage />
      ) : !chats ? (
        <div className="h-full max-w-[calc(100%-24.5rem)] w-[calc(100%-24.5rem)] flex text-white justify-center items-center text-xl">
          Loading....
        </div>
      ) : (
        <div className="h-full text-white max-w-[calc(100%-24.5rem)] w-[calc(100%-24.5rem)] bg-black4">
          <div className="flex flex-col h-full w-full">
            <div className="flex flex-row items-center justify-between px-4 py-2 border-b border-black3">
              <UserLogo user={otherUser} />
            </div>
            <div className="flex w-full h-auto flex-col p-4  pt-6 flex-1 gap-10 overflow-y-auto">
              {/* chat message */}
              {chats?.map((item: any) => (
                <div className="flex gap-4" key={item._id} ref={scroll}>
                  {item.senderId === currentUser.id ? (
                    <ChatMessage
                      data={item.messages}
                      user={currentUser}
                      isCurrentUser={true}
                    />
                  ) : (
                    <ChatMessage
                      data={item.messages}
                      user={otherUser}
                      isCurrentUser={false}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* input for messages */}
            <div className="w-full h-[5rem] justify-center items-center bg-transparent">
              <form
                onSubmit={(e: any) => onSubmit(e)}
                className="flex h-full flex-row items-center justify-center px-4 border-black3"
              >
                <input
                  type="text"
                  className="w-full h-10 px-4 text-sm text-white outline-none bg-black3 rounded-md"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e: any) => setMessage(e.target.value)}
                />
                <button
                  className="flex items-center justify-center w-10 h-10 ml-2 text-white"
                  type="submit"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DmsComponent;

const DmsErrorPage = () => (
  <div className="flex flex-col h-full max-w-[calc(100%-24.5rem)] w-[calc(100%-24.5rem)]">
    <div className="flex flex-row items-center justify-between px-4 py-2 border-b border-black3">
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center justify-center w-10 h-10 rounded-full bg-black3">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </div>
        <div className="flex flex-col ml-2">
          <div className="text-sm font-semibold">New Message</div>
          <div className="text-xs text-gray-400">
            Select a user to start a conversation
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="flex flex-row items-center justify-center w-20 h-20 rounded-full bg-black3">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </div>
        <div className="text-sm font-semibold">No Messages</div>
        <div className="text-xs text-gray-400">
          Select a user to start a conversation
        </div>
      </div>
    </div>
  </div>
);

const UserLogo = ({ color, user }: any) => {
  const router = useRouter();

  return (
    <>
      {user?.id === router.query?.id ? (
        <div className="flex items-center gap-2">
          <Avatar
            name={user.username || "loading"}
            round={true}
            size="40"
            textSizeRatio={2}
            color={color}
          />
          <span>{user.username || "loading"}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Avatar
            name={"loading"}
            round={true}
            size="40"
            textSizeRatio={2}
            color={color}
          />
          <span>Loading</span>
        </div>
      )}
    </>
  );
};

const ChatMessage = ({ data, user, isCurrentUser }: any) => {
  const router = useRouter();
  return (
    <>
      {user?.id === router.query?.id || isCurrentUser ? (
        <>
          <Avatar
            name={user.username || "loading"}
            round={true}
            size="40"
            textSizeRatio={2}
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center">
              <div className="text-sm text-white text-opacity-50">
                {user.username || "loading"}
              </div>
              <div className="text-xs text-gray-400 ml-2 text-opacity-40">
                {format(data[0].createdAt) || "loading"}
              </div>
            </div>
            <div className="text-sm text-white text-opacity-60">
              {data[0].messages || "loading"}
            </div>
          </div>
        </>
      ) : (
        <>
          <Avatar name={"loading"} round={true} size="40" textSizeRatio={2} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center">
              <div className="text-sm text-white text-opacity-50">
                {"loading"}
              </div>
              <div className="text-xs text-gray-400 ml-2 text-opacity-40">
                {"loading"}
              </div>
            </div>
            <div className="text-sm text-white text-opacity-60">
              {"loading"}
            </div>
          </div>
        </>
      )}
    </>
  );
};
