import React, { useEffect, useRef, useContext } from "react";
import Avatar from "react-avatar";
import { SendIcon, EmojiIcon, CloseIcon } from "../../../Icons/Icons";
import { useRouter } from "next/router";
import {
  UserDataContext,
  ServerDataContext,
  SocketTransferData,
} from "../../../Context/ContextProvide";
import { sendMessage } from "../../../libs/chats";
import { format } from "timeago.js";

import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  SuggestionMode,
  SkinTonePickerLocation,
} from "emoji-picker-react";

const DmsComponent = () => {
  const router = useRouter();

  const [isError, setIsError] = React.useState(false);

  const { userData } = useContext(UserDataContext);
  const { chats, messagesData, setMessagesData, chatId } =
    useContext(ServerDataContext);
  const { setChatMessageSocket } = useContext(SocketTransferData);

  const [otherUser, setOtherUser] = React.useState<any>([]);

  const [messages, setMessages] = React.useState<any>([]);

  const [message, setMessage] = React.useState("");

  const scroll = useRef<any>();

  const [showEmoji, setShowEmoji] = React.useState(false);

  useEffect(() => {
    setMessages([]);
    setOtherUser([]);

    const retCurrentChat = chats?.filter((chat: any) => chat.chatId === chatId);

    console.log("data", retCurrentChat);
    if (retCurrentChat.length <= 0) {
      setIsError(true);
    } else {
      setIsError(false);
      const retMessage = messagesData?.filter(
        (msg: any) => msg.chatId === chatId
      );
      if (retMessage.length > 1) {
        retMessage.pop();
      }
      setOtherUser(retCurrentChat[0].users);
      setMessages(retMessage[0].users);
    }
  }, [chatId]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const init = async () => {
      const { data } = await sendMessage(userData.uid, chatId, message);
      if (data.status === "Ok") {
        setMessagesData((prev: any) => {
          const ret = prev.filter((msg: any) => msg.chatId === chatId);
          const ret2 = prev.filter((msg: any) => msg.chatId !== chatId);
          ret[0].users.push(data.data.data);
          return [...ret2, ...ret];
        });
      }
      const receiverId = otherUser.id;
      console.log("data")
      setChatMessageSocket({ receiverId, chatId, data: data.data.data });
    };
    init();
    setMessage("");
  };

  // always scroll to the bottom
  useEffect(() => {
    console.log(messagesData);
    scroll.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messagesData]);

  useEffect(() => {
    scroll.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  }, [messages]);

  const clickedEmoji = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMessage(message + emojiData.emoji);
  };

  return (
    <>
      {isError ? (
        <DmsErrorPage />
      ) : !messages ? (
        <div className="h-full max-w-full w-full flex text-white justify-center items-center text-xl">
          Loading....
        </div>
      ) : (
        <div className="h-full text-white max-w-full w-full bg-black4 ">
          <div className="flex flex-col h-full w-full relative justify-start items-start">
            <div
              className="flex flex-row items-center justify-between px-4 py-2 border-b border-black3"
              onClick={() => setShowEmoji(false)}
            >
              <UserLogo user={otherUser} />
            </div>
            {showEmoji && (
              <div className="absolute h-[18.75rem] w-[25rem] bottom-32">
                <EmojiPicker
                  onEmojiClick={clickedEmoji}
                  theme={Theme.AUTO}
                  skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
                  height={350}
                  width="100%"
                  emojiVersion="0.6"
                  lazyLoadEmojis={true}
                  suggestedEmojisMode={SuggestionMode.RECENT}
                  skinTonesDisabled
                  searchPlaceHolder="Filter"
                  defaultSkinTone={SkinTones.MEDIUM}
                  emojiStyle={EmojiStyle.NATIVE}
                />
              </div>
            )}
            <div
              className="flex w-full h-auto flex-col p-4  pt-6 flex-1 gap-10 overflow-y-auto"
              onClick={() => setShowEmoji(false)}
            >
              {/* chat message */}
              {messages?.map((item: any) => (
                <div className="flex gap-4" key={item._id} ref={scroll}>
                  {item.senderId === userData.id ? (
                    <ChatMessage
                      data={item.messages}
                      user={userData}
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
                className="flex h-full flex-row items-center justify-center px-4 border-black3 gap-4"
              >
                <div
                  className="w-10 h-10"
                  onClick={() => setShowEmoji(!showEmoji)}
                >
                  {showEmoji ? <CloseIcon /> : <EmojiIcon />}
                </div>
                <input
                  type="text"
                  className="w-full h-10 px-4 text-sm text-white outline-none bg-black3 rounded-md"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e: any) => setMessage(e.target.value)}
                  onClick={() => setShowEmoji(false)}
                />
                <button
                  aria-label="send message"
                  className="flex items-center justify-center w-10 h-10 text-white"
                  type="submit"
                  onClick={() => setShowEmoji(false)}
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
                {format(data[0]?.createdAt) || "loading"}
              </div>
            </div>
            <div className="text-sm text-white text-opacity-60">
              {data[0]?.messages || "loading"}
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
