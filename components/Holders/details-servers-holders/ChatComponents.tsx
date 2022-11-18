import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  EmojiClickData,
  SuggestionMode,
  SkinTonePickerLocation,
} from "emoji-picker-react";
import { useRouter } from "next/router";
import React, { useEffect, useContext, useRef, useState } from "react";
import Avatar from "react-avatar";
import {
  ServerDataContext,
  UserDataContext,
  SocketTransferData,
} from "../../../Context/ContextProvide";
import { CloseIcon, EmojiIcon, SendIcon } from "../../../Icons/Icons";
import { format } from "timeago.js";
import { sendMessage } from "../../../libs/server";

const ChatComponents = () => {
  const messageRef = useRef<any>(null);
  const { userData } = useContext(UserDataContext);
  const { serversData, serverChat, setServerChat } =
    useContext(ServerDataContext);
  const { setServerChatMessageSocket } = useContext(SocketTransferData);
  const [chat, setChat] = useState<any>([]);
  const [message, setMessage] = useState<any>("");
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [usersData, setUserData] = React.useState<any>([]);
  useEffect(() => {}, [serverChat]);
  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  const clickedEmoji = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMessage(message + emojiData.emoji);
  };

  React.useEffect(() => {
    if (serversData) {
      const members = serversData?.members;
      setUserData(members);
    }
  }, [serversData]);

  React.useEffect(() => {
    if (serverChat.length !== 0 && chat.length === 0) {
      setChat(serverChat.users);
    } else if (serverChat.length !== 0 && chat.length > 0) {
      setChat(serverChat.users);
    }
  }, [serverChat]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (message) {
      const init = async () => {
        const { data } = await sendMessage(
          userData?.id,
          serversData?.serverId,
          message
        );
        if (data.status === "Ok") {
          setServerChatMessageSocket({
            serverId: serversData?.serverId,
            data: data.data.data,
          });
        }
      };
      init();
      setMessage("");
    }
  };
  return (
    <div className="h-full text-white max-w-full w-full bg-black4 ">
      <div className="flex flex-col h-full w-full relative justify-start items-start">
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
          {usersData?.length > 0 &&
            chat &&
            chat?.map((item: any) => (
              <div className="flex gap-4" key={item?._id} ref={messageRef}>
                <>
                  <ChatMessage
                    data={item?.messages || []}
                    user={usersData || []}
                    isCurrentUser={item?.senderId || ""}
                  />
                </>
              </div>
            ))}
        </div>
        {/* input for messages */}
        <div className="w-full h-[5rem] justify-center items-center bg-transparent">
          <form
            onSubmit={(e: any) => handleSubmit(e)}
            className="flex h-full flex-row items-center justify-center px-4 border-black3 gap-4"
          >
            <div className="w-10 h-10" onClick={() => setShowEmoji(!showEmoji)}>
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
  );
};

export default ChatComponents;

const ChatMessage = ({ data, user, isCurrentUser }: any) => {
  const [currentUser, setCurrentUser] = useState<any>([]);
  useEffect(() => {
    if (user) {
      const currentUser = user.filter(
        (item: any) => item.userId === isCurrentUser
      );

      setCurrentUser(currentUser[0]);
    }
  }, [user]);
  return (
    <>
      {currentUser.length !== 0 ? (
        <>
          <Avatar
            name={currentUser.userName}
            round={true}
            size="40"
            textSizeRatio={2}
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center">
              <div className="text-sm text-white text-opacity-50">
                {currentUser.userName}
              </div>
              <div className="text-xs text-gray-400 ml-2 text-opacity-40">
                {format(data[0]?.createdAt)}
              </div>
            </div>
            <div className="text-sm text-white text-opacity-60">
              {data[0]?.messages}
            </div>
          </div>
        </>
      ) : (
        <>
          <Avatar name={"loading"} round={true} size="40" textSizeRatio={2} />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center">
              <div className="text-sm text-white text-opacity-50">loading</div>
              <div className="text-xs text-gray-400 ml-2 text-opacity-40">
                loading
              </div>
            </div>
            <div className="text-sm text-white text-opacity-60">loading</div>
          </div>
        </>
      )}
    </>
  );
};
