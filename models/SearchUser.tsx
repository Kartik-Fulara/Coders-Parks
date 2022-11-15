import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import {
  CloseCircle,
  SendMessage,
  AddFriends,
  CheckIcon,
  Refresh,
  LoadingAnimIcon,
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
  const [isDecline, setIsDecline] = React.useState<boolean>(false);
  const [isAccept, setIsAccept] = React.useState<boolean>(false);
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

    // console.log(sentFriends);

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
        // console.log(sendRequests);
        setSendRequests((prev: any) => {
          const sentRetFriends = prev.filter(
            (friend: any) => friend.friend !== sentFriends[0].friend
          );
          const newSentRetFriends = [...sentRetFriends, ...sentFriends];
          return newSentRetFriends;
        });
        setCanSendReq(false);
        setIsReq(false);
      }
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const init = async () => {
      const { data } = await queryUserByUserName(userName);

      if (data?.data.data !== undefined) {
        const { data: searchUserData } = data.data;
        // console.log(searchUserData);
        // console.log(chats);
        const isAlreadyInChat = chats?.filter(
          (chat: any) => chat?.users?.id === searchUserData?.id
        );
        // console.log(isAlreadyInChat);
        const reqData = [
          ...friends,
          ...sendRequests,
          ...pendingRequests,
        ]?.filter((req: any) => req.friend === searchUserData?.id);

        // console.log(reqData);
        if (searchUserData?.id !== userData?.id) {
          if (reqData.length > 0 && reqData[0].isAccept) {
            setIsAccept(true);
            if (isAlreadyInChat !== undefined && isAlreadyInChat.length > 0) {
              setCanSendMessage(false);
            } else {
              setCanSendMessage(true);
            }
            setCanSendReq(false);
            setUser({ ...searchUserData });
          } else {
            setIsAccept(false);
            if (isAlreadyInChat !== undefined && isAlreadyInChat.length > 0) {
              setCanSendMessage(false);
            } else {
              setCanSendMessage(true);
            }
            if (reqData !== undefined && reqData.length > 0) {
              setCanSendReq(false);
              // console.log(reqData[0]);
              reqData[0].isReq === true ? setIsReq(true) : setIsReq(false);
              if (reqData[0].isDecline && reqData[0].isReq) {
                setIsDecline(true);
              } else {
                setIsDecline(false);
              }
            } else {
              setCanSendReq(true);
            }
          }
          setUser({ ...searchUserData });
        } else {
          setCanSendMessage(false);
          setCanSendReq(false);
          setUser({ ...searchUserData });
        }
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

  const handleAddFriends = (id: any, event: any) => {
    setLoading({ ...loading, friend: true });
    const init = async () => {
      const { data } = await addFriends(id);
      // console.log(data);
      if (data === undefined) {
        setLoading({ ...loading, friend: false });
        toast.error("Something went wrong");
        return;
      }
      const { message, friendData, myData }: any = data;
      // console.log(friendData);
      // console.log(myData);
      if (message === "Friend added") {
        toast.success("Friend Request Sent");
        setFriendsData([myData]);
        setRequestSocket({ receiverId: id, reqData: friendData });
        setLoading({ ...loading, friend: false });
        if (event === "add") {
          canSendReq === true ? setCanSendReq(false) : setCanSendReq(true);
          canSendReq === false && myData.isReq === true
            ? setIsReq(false)
            : setIsReq(true);
        } else {
          setCanSendReq(false);
          setIsReq(true);
          setIsDecline(false);
        }
      } else {
        toast.error("Request Not Send Try Again");
        setLoading({ ...loading, friend: false });
      }
    };
    init();
  };

  useEffect(() => {
    const isFriend = friends?.filter(
      (friend: any) => friend.friend === user?.friend
    );
    if (isFriend.length > 0) {
      setCanSendReq(false);
      setIsAccept(true);
    }
    const isInPending = pendingRequests?.filter(
      (friend: any) => friend.friend === user?.friend
    );
    if (isInPending.length > 0) {
      setCanSendReq(false);
      setIsAccept(false);
    }
    const isInSendReq = sendRequests?.filter(
      (friend: any) => friend.friend === user?.friend
    );
    if (isInSendReq.length > 0) {
      setCanSendReq(false);
      setIsAccept(false);
    }
  }, [friends, pendingRequests, sendRequests, user]);

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
                        onClick={() => handleAddFriends(user?.id, "add")}
                        className="bg-blue-700 text-white font-bold p-2 rounded-3xl h-10 w-full sm:w-10"
                      >
                        <AddFriends />
                      </button>
                    ) : (
                      <button
                        aria-label="Add Friends"
                        type="button"
                        disabled
                        className="pl-2  bg-blue-700 text-white font-bold  rounded-3xl h-10 w-full sm:w-10 flex justify-center items-center"
                      >
                        {/* loading */}

                        <LoadingAnimIcon />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full sm:w-fit py-4 flex justify-center items-center">
                    {!isAccept && (
                      <>
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
                          <>
                            {!isDecline ? (
                              <div className="bg-transparent text-white font-bold h-full flex items-center justify-center w-fit">
                                <span className="w-44">Waiting For Accept</span>
                              </div>
                            ) : (
                              <button
                                aria-label="Add Friends"
                                type="button"
                                onClick={() =>
                                  handleAddFriends(user?.id, "again")
                                }
                                className="bg-green-500  justify-center items-center flex text-white font-bold p-2 rounded-3xl h-10 w-full sm:w-10"
                              >
                                <div className="h-10 w-10">
                                  <Refresh />
                                </div>
                                <div className="flex w-32 sm:hidden">
                                  Resend Request
                                </div>
                              </button>
                            )}
                          </>
                        )}
                      </>
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
