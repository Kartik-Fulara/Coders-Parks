import React from "react";
import tw from "tailwind-styled-components";
import {
  CloseCircle,
  SendMessage,
  AddFriends,
  CheckIcon,
} from "../Icons/Icons";
import Avatar from "react-avatar";
import { startChat } from "../libs/chats";

import { queryUserByUserName, addFriends } from "../libs/chats";
import toast from "react-hot-toast";
import {
  UserDataContext,
  ServerDataContext,
  SocketTransferData,
} from "../Context/ContextProvide";

const SearchUserComponent = tw.section`
    absolute
    flex
    flex-col
    items-center
    justify-center
    h-screen
    z-[100]
    w-screen
    bg-[rgba(0,0,0,0.5)]
`;

const SearchUserWrapper = tw.div`
    flex
    flex-col
    items-center
    justify-center
    w-[80%]
    h-[25rem]
    lg:w-[30rem]
    lg:h-[30rem]
    xl:h-[40rem]
    xl:w-[40rem]
    bg-black4
    text-white
`;

const SearchUser = ({ handleModelClose, handleCall, setSendReq }: any) => {
  const [userName, setUserName] = React.useState<string>("");
  const [canSendMessage, setCanSendMessage] = React.useState<boolean>(true);
  const [canSendReq, setCanSendReq] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<any>({
    chat: false,
    friend: false,
  });
  const {
    chats,
    setChats,
    setFriends,
    setSendRequests,
    setPendingRequests,
    sendRequests,
    pendingRequests,
    friends,
  } = React.useContext(ServerDataContext);
  const { userData } = React.useContext(UserDataContext);
  const { setRequestSocket } = React.useContext(SocketTransferData);
  const [user, setUser] = React.useState<any>(null);
  const [isReq, setIsReq] = React.useState<boolean>(false);

  const setFriendsData = (friendsData: any) => {
    const acceptedFriends = friendsData.filter(
      (friend: any) => friend.isAccept === true
    );
    const pendingFriends = friendsData.filter(
      (friend: any) => friend.isAccept === false && friend.isReq === false
    );
    const sentFriends = friendsData.filter(
      (friend: any) => friend.isAccept === false && friend.isReq === true
    );

    if (acceptedFriends.length !== 0) {
      if (friends.length === 0) {
        setFriends(acceptedFriends);
      } else {
        const newFriends = [...friends, ...acceptedFriends];
        setFriends(newFriends);
      }
    }
    if (pendingFriends.length !== 0) {
      if (pendingRequests.length === 0) {
        setPendingRequests(pendingFriends);
      } else {
        const newPendingFriends = [...pendingRequests, ...pendingFriends];
        setPendingRequests(newPendingFriends);
      }
    }
    if (sentFriends.length !== 0) {
      if (sendRequests.length === 0) {
        setSendRequests(sentFriends);
      } else {
        const newSentFriends = [...sendRequests, ...sentFriends];
        setSendRequests(newSentFriends);
      }
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const init = async () => {
      const { data } = await queryUserByUserName(userName);

      if (data?.data.data !== undefined) {
        const { data: searchUserData } = data.data;
        console.log(searchUserData);
        console.log(chats);
        const isAlreadyInChat = chats?.filter(
          (chat: any) => chat?.users?.id === searchUserData?.id
        );
        console.log(isAlreadyInChat);
        const reqData = [...sendRequests, ...pendingRequests]?.filter(
          (req: any) => req.friend === searchUserData?.id
        );

        console.log(reqData);

        if (searchUserData?.id !== userData?.id) {
          if (isAlreadyInChat !== undefined && isAlreadyInChat.length > 0) {
            setCanSendMessage(false);
          } else {
            setCanSendMessage(true);
          }
          if (reqData !== undefined && reqData.length > 0) {
            setCanSendReq(false);
            reqData[0].isReq === true ? setIsReq(true) : setIsReq(false);
          } else {
            setCanSendReq(true);
          }
        } else {
          setCanSendMessage(false);
          setCanSendReq(false);
        }
        setUser({ ...searchUserData });
      } else {
        setUser("");
      }
    };
    init();
    setUserName("");
  };

  const handleStartChat = () => {
    setLoading({ ...loading, chat: true });
    const init = async () => {
      const { data } = await startChat(user.id);
      if (data !== undefined) {
        setLoading({ ...loading, chat: false });
        const chatData = data.currentChats;
        setChats([...chats, chatData]);
      }

      handleModelClose();
    };
    init();
  };

  const handleAddFriends = (id: any) => {
    setLoading({ ...loading, friend: true });
    const init = async () => {
      const { data } = await addFriends(id);
      console.log(data);
      const { message, friendData, myData }: any = data;
      console.log(friendData);
      console.log(myData);
      if (message === "Friend added") {
        toast.success("Friend Request Sent");
        setFriendsData([myData]);
        setRequestSocket({ receiverId: id, reqData: friendData });
        setLoading({ ...loading, friend: false });
        canSendReq === true ? setCanSendReq(false) : setCanSendReq(true);
        canSendReq === false && myData.isReq === true
          ? setIsReq(true)
          : setIsReq(false);
      } else {
        toast.error("Request Not Send Try Again");
        setLoading({ ...loading, friend: false });
      }
    };
    init();
  };

  return (
    // @ts-ignore
    <SearchUserComponent>
      <SearchUserWrapper>
        <div className="h-16 w-full flex px-6 mb-4 justify-end items-end">
          <span
            className="h-10 w-10  cursor-pointer"
            onClick={() => handleModelClose(false)}
          >
            <CloseCircle />
          </span>
        </div>
        <div className="flex flex-col w-full h-full justify-start items-center gap-6 ">
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col lg:flex-row justify-center gap-4  items-center"
          >
            <input
              type="text"
              placeholder="Search User"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-10 w-[80%] lg:w-[20rem] bg-black1 rounded-lg text-white text-lg font-medium px-4"
            />
            <button
              type="submit"
              className="w-[80%] lg:w-[10rem] h-fit bg-black2 text-white py-2 pb-3 rounded-3xl cursor-pointer"
            >
              Search
            </button>
          </form>
          {(user !== " " || user !== "") && user ? (
            <div className="flex flex-col sm:flex-row w-[90%] justify-between p-4 items-center  h-fit bg-black2 rounded-3xl gap-4">
              <div className="w-full h-full flex gap-4 items-center justify-start">
                <Avatar
                  name={user?.username}
                  size="50"
                  round={true}
                  src={user?.profilePicture}
                />
                <span className="text-white text-opacity-80">
                  {user?.username}
                </span>
              </div>
              <div className="flex gap-4 justify-center items-center flex-col sm:flex-row w-full sm:w-fit">
                {canSendMessage && (
                  <button
                    aria-label="Start Chat"
                    type="button"
                    className="bg-blue-700 text-white font-bold rounded-3xl h-10 w-full sm:w-20 flex items-center justify-center"
                    onClick={handleStartChat}
                  >
                    Say Hi
                  </button>
                )}
                {canSendReq ? (
                  <>
                    {!loading.friend ? (
                      <button
                        aria-label="Add Friends"
                        type="button"
                        onClick={() => handleAddFriends(user?.id)}
                        className="bg-blue-700 text-white font-bold p-2 rounded-3xl h-10 w-full sm:w-10"
                      >
                        <AddFriends />
                      </button>
                    ) : (
                      <button
                        aria-label="Add Friends"
                        type="button"
                        disabled
                        onClick={() => handleAddFriends(user?.id)}
                        className="bg-blue-700 text-white font-bold p-2 rounded-3xl h-10 w-full sm:w-10"
                      >
                        {/* loading */}

                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
                          ></path>
                        </svg>
                      </button>
                    )}
                  </>
                ) : (
                  <div className=" w-fit py-4 flex justify-center items-center">
                    {!isReq ? (
                      <div className="gap-4 flex justify-center items-center rounded-3xl h-full w-fit">
                        <span className="h-10 w-10  bg-transparent text-green-500 font-bold rounded-3xl">
                          <CheckIcon />
                        </span>
                        <span className="h-10 w-10  bg-transparent text-red-700 font-bold rounded-3xl">
                          <CloseCircle />
                        </span>
                      </div>
                    ) : (
                      <div className="bg-transparent text-white font-bold h-full flex items-center justify-center w-fit">
                        <span className="w-44">Waiting For Accept</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            user !== null && (
              <div className="flex w-[90%] justify-center p-4 items-center  h-fit bg-black2 rounded-3xl">
                <div className="w-full h-full flex gap-4 items-center justify-center">
                  <span className="text-white text-opacity-80">NOT FOUND</span>
                </div>
              </div>
            )
          )}
        </div>
      </SearchUserWrapper>
    </SearchUserComponent>
  );
};

export default SearchUser;

// Image preview Component

// Language: typescript
