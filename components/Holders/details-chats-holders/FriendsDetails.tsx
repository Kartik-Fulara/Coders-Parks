import React, { useContext, useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import Avatar from "react-avatar";
import {
  acceptFriend,
  addFriends,
  rejectFriend,
  removeFriend,
  declineReq,
} from "../../../libs/chats";

import { LoadingAnimIcon } from "../../../Icons/Icons";

import {
  ServerDataContext,
  SocketTransferData,
} from "../../../Context/ContextProvide";
import toast from "react-hot-toast";

const NavBar = tw.nav`
    flex
    justify-start
    items-center
    h-[var(--friendsDetails-nav-height)]
    w-full
    gap-4
    bg-black2
    text-white
    text-lg
    font-medium
    px-4
    mb-4
    
`;

const FriendsDetails = ({ setRecieveReq }: any) => {
  const [pending, setIsPending] = useState(false);

  return (
    <div className="h-full max-w-full w-full bg-black4">
      {/* @ts-ignore */}
      <NavBar>
        <span className="w-16 select-none ">Friends</span>
        <span className="h-[80%] w-1  bg-black4"></span>
        <div className="flex w-[calc(100%-4.025rem)] h-full gap-2 justify-start items-center">
          <span
            onClick={() => setIsPending(false)}
            className={`uppercase cursor-pointer select-none text-white w-16  text-center  ${
              !pending
                ? "bg-black text-white h-[60%] rounded-lg text-opacity-100 pt-[0.09rem] "
                : "text-opacity-50"
            }`}
          >
            All
          </span>
          <span
            onClick={() => {
              setIsPending(true);
              setRecieveReq(false);
            }}
            className={`uppercase cursor-pointer select-none text-white w-32 text-center  ${
              pending
                ? "bg-black text-white h-[60%] rounded-lg text-opacity-100 pt-[0.09rem] "
                : "text-opacity-50"
            }`}
          >
            Requests
          </span>
        </div>
      </NavBar>
      {pending ? <DisplayFriendsRequests /> : <DisplayAllFriends />}
    </div>
  );
};

export default FriendsDetails;

const LoadingBtn = () => (
  <button
    type="button"
    aria-label="Loading"
    className="flex gap-4 items-center h-10 w-10"
    disabled
  >
    <LoadingAnimIcon />
  </button>
);

const DisplayAllFriends = () => {
  const { friends, setFriends } = useContext(ServerDataContext);
  const { setRemoveFriendSocket } = useContext(SocketTransferData);
  const [removeFriendLoading, setRemoveFriendLoading] = useState(false);
  const [frndId, setFrndId] = useState("");

  const removeFrnds = async (friendsId: any) => {
    setRemoveFriendLoading(true);
    setFrndId(friendsId);
    const { data } = await removeFriend(friendsId);
    if (data.status === "Ok") {
      const { data: retData } = data;
      // console.log(retData);
      if (retData.message === "Friend removed") {
        setRemoveFriendLoading(false);
        setFrndId("");
        setRemoveFriendSocket({
          receiverId: friendsId,
          removeData: retData.friendData,
        });
        const { friend } = retData.myData;
        // console.log(friend);
        setFriends((prev: any) => {
          return prev.filter((frnd: any) => frnd.friend !== friend);
        });
        toast.success("Friend removed");
      } else {
        setRemoveFriendLoading(false);
        toast.error("Something went wrong!!");
      }
    }
  };

  useEffect(() => {
    if (friends !== undefined && friends[0]?.length === 0) {
      setFriends([]);
    }
  }, [friends]);

  return (
    <div className="h-full w-full flex flex-col gap-4 text-white px-4">
      {friends.length === 0 && (
        <NoFriends msg={`No Friends! Why Don't You Search new Friends `} />
      )}
      {friends?.map((friend: any) => (
        <div
          className="h-[4rem] w-full flex justify-between items-center px-4 bg-black2 rounded-md"
          key={friend.friend}
        >
          <div className="flex gap-4 items-center">
            <div className="h-[3rem] w-[3rem]">
              <Avatar
                src={friend?.profilePic}
                name={friend?.username}
                round={true}
                textSizeRatio={1.75}
                className="h-full w-full"
              />
            </div>
            <span>{friend.username}</span>
          </div>
          {!removeFriendLoading && frndId !== friend.friend ? (
            <div
              className="flex gap-4 items-center pb-1"
              onClick={() => removeFrnds(friend.friend)}
            >
              <span className="text-red-500 hover:text-opacity-100 text-opacity-50 hover:bg-black4 h-[80%] w-fit p-2 cursor-pointer rounded-md">
                Remove Friend
              </span>
            </div>
          ) : (
            friend.friend === frndId && <LoadingBtn />
          )}
        </div>
      ))}
    </div>
  );
};

const AcceptFriendsRequests = (friendId: any) => {
  const { setFriends, setSendRequests, setPendingRequests } =
    useContext(ServerDataContext);

  const [loading, setLoading] = useState(false);

  const { setRejectReq, setAddFrnd } = useContext(SocketTransferData);

  const handleEvents = (data: any, event: any) => {
    // console.log(data);
    // console.log(event);
    if (
      data.status === "Ok" ||
      data.message === "Friend added" ||
      data.message === "Friend Request Cancel"
    ) {
      const { friendData, myData } = data;
      // console.log(data);
      if (!friendData.isAccept) {
        if (!friendData.isReq) {
          setSendRequests((prev: any) => {
            return prev.filter((frnd: any) => frnd.friend !== myData.friend);
          });
        } else {
          setPendingRequests((prev: any) => {
            return prev.filter((frnd: any) => frnd.friend !== myData.friend);
          });
        }
      } else {
        setPendingRequests((prev: any) => {
          return prev.filter((frnd: any) => frnd.friend !== myData.friend);
        });
        setFriends((prev: any) => {
          const remFrnd = prev.filter(
            (frnd: any) => frnd.friend !== myData.friend
          );
          return [...remFrnd, myData];
        });
      }
      if (event === "accept") {
        setAddFrnd({ receiverId: friendId, accData: friendData });
      } else if (event === "reject") {
        setRejectReq({ receiverId: friendId, rejData: friendData });
      }
      toast.success("Friend Request Accepted");
    } else {
      // console.log("hello");
      toast.error("Something went wrong!!");
    }
  };

  const acceptFrnd = async () => {
    setLoading(true);
    const response = await acceptFriend(friendId);
    // console.log(response);
    if (response?.status === "ok") {
      setLoading(false);
      const { data } = response;
      // console.log(data);
      const { data: accData } = data;
      // console.log(accData);
      handleEvents(accData, "accept");
    } else if (response?.status === "error") {
      toast.error("Something went wrong");
    }
  };

  const rejectFrnd = async () => {
    let frndId;
    setLoading(true);
    // console.log(friendId);
    if (typeof friendId === "string") {
      frndId = friendId;
    } else {
      frndId = friendId.friendId;
    }
    const response = await declineReq(frndId);
    // console.log(response);
    if (response?.status === "ok") {
      setLoading(false);
      const { data } = response;
      // console.log(data);
      const { data: rejData } = data;
      // console.log(rejData);
      if (rejData !== undefined) {
        handleEvents(rejData, "reject");
      } else {
        toast.error("Something went wrong!!");
      }
    } else if (response?.status === "error") {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {!loading ? (
        <div className="w-full h-full flex gap-5">
          <div
            onClick={() => acceptFrnd()}
            className="text-green-500 hover:bg-black4 h-[80%] w-fit p-2 cursor-pointer select-none rounded-md"
          >
            Accept
          </div>
          <div
            onClick={() => rejectFrnd()}
            className="text-red-700 hover:bg-black4 h-[80%] w-fit p-2 cursor-pointer select-none rounded-md"
          >
            Reject
          </div>
        </div>
      ) : (
        <LoadingBtn />
      )}
    </>
  );
};

const WaitingAcceptRequests = ({ friendId, decline }: any) => {
  const { setRequestSocket, setRemoveReq } = useContext(SocketTransferData);

  const [rejectLoading, setRejectLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { setSendRequests } = useContext(ServerDataContext);

  const handleReq = (data: any) => {
    setSendRequests((prev: any) => {
      const ret = prev.filter((req: any) => req.friend !== data.friend);
      const newReq = [...ret, data];
      return newReq;
    });
  };

  const rejectRequest = async () => {
    setRejectLoading(true);
    const response = await rejectFriend(friendId);
    if (response?.status === "ok") {
      const { data } = response;
      setRejectLoading(false);
      if (data === undefined) {
        toast.error("Something went wrong");
        return;
      }
      if (data.status === "Error") {
        toast.error("Something went wrong");
        return;
      }
      const { data: rejectData } = data;
      // console.log(rejectData);
      if (rejectData.message === "Friend Request Cancel") {
        setRemoveReq({ receiverId: friendId, rejData: rejectData.friendData });
        handleReq(rejectData.myData);

        toast.success("Friend Request Cancelled");
      }
    } else if (response?.status === "error") {
      toast.error("Something went wrong");
    }
  };

  const resendRequest = async () => {
    setResendLoading(true);
    const response = await addFriends(friendId);
    // console.log(response);
    if (response) {
      const { data } = response;
      setResendLoading(false);
      if (data.message === "Friend added") {
        setRequestSocket({ receiverId: friendId, reqData: data.friendData });
        handleReq(data.myData);
        toast.success("Friend Request Sent");
      }
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full h-full flex gap-5">
      {decline ? (
        <>
          {!resendLoading ? (
            <div
              onClick={() => resendRequest()}
              className="text-green-700 hover:bg-black4"
            >
              Resend Requests
            </div>
          ) : (
            <LoadingBtn />
          )}
        </>
      ) : (
        <>
          {!rejectLoading ? (
            <>
              <div className="text-gray-600">
                Waiting for Requests to Accept
              </div>
              <div
                onClick={() => rejectRequest()}
                className="text-red-700 hover:bg-black4"
              >
                Cancel Requests
              </div>
            </>
          ) : (
            <>
              <LoadingBtn />
            </>
          )}
        </>
      )}
    </div>
  );
};

const DisplayFriendsRequests = () => {
  const { pendingRequests, sendRequests } = useContext(ServerDataContext);
  const [checkBox, setCheckBox] = useState({
    all: true,
    recieve: false,
    send: false,
  });
  const [requests, setRequests] = useState<any>([]);

  useEffect(() => {
    if (checkBox.all) {
      setRequests([...pendingRequests, ...sendRequests]);
    } else if (checkBox.recieve) {
      setRequests([...pendingRequests]);
    } else if (checkBox.send) {
      setRequests([...sendRequests]);
    }
  }, [pendingRequests]);

  useEffect(() => {
    if (checkBox.all) {
      setRequests([...pendingRequests, ...sendRequests]);
    } else if (checkBox.recieve) {
      setRequests([...pendingRequests]);
    } else if (checkBox.send) {
      setRequests([...sendRequests]);
    }
  }, [sendRequests]);

  useEffect(() => {
    if (checkBox.all) {
      setRequests([...pendingRequests, ...sendRequests]);
    } else if (checkBox.recieve) {
      setRequests([...pendingRequests]);
    } else if (checkBox.send) {
      setRequests([...sendRequests]);
    }
  }, [checkBox]);

  return (
    <>
      <div className="w-full h-10 flex justify-end items-center">
        {/* custom checkbox */}
        <div className="flex justify-start items-center gap-4 px-4">
          <div
            onClick={() => {
              setCheckBox({ recieve: false, send: false, all: true });
            }}
            className={`h-4 w-4 rounded-md border-2 cursor-pointer border-white ${
              checkBox.all ? "bg-black border-white" : "bg-white"
            }`}
            id="all"
          ></div>
          <label
            onClick={() => {
              setCheckBox({ recieve: false, send: false, all: true });
            }}
            htmlFor="all"
            className="text-white cursor-pointer select-none"
          >
            All
          </label>
          <div
            onClick={() => {
              setCheckBox({
                send: false,
                recieve: true,
                all: false,
              });
            }}
            className={`h-4 w-4 rounded-md border-2 border-white cursor-pointer ${
              checkBox.recieve ? "bg-black border-white" : "bg-white"
            }`}
            id="recieve"
          ></div>
          <label
            htmlFor="recieve"
            className="text-white cursor-pointer select-none"
            onClick={() => {
              setCheckBox({
                send: false,
                recieve: true,
                all: false,
              });
            }}
          >
            Recieved
          </label>
          <div
            onClick={() => {
              setCheckBox({ recieve: false, send: true, all: false });
            }}
            id="sent"
            className={`h-4 w-4 rounded-md border-2 border-white cursor-pointer ${
              checkBox.send ? "bg-black border-white" : "bg-white"
            }`}
          ></div>
          <label
            htmlFor="sent"
            onClick={() => {
              setCheckBox({ recieve: false, send: true, all: false });
            }}
            className="text-white cursor-pointer select-none"
          >
            Sent
          </label>
        </div>
      </div>
      <div className="h-full w-full flex flex-col gap-4 p-4 text-white">
        {pendingRequests.length === 0 &&
          sendRequests.length === 0 &&
          checkBox.all && <NoFriends msg={"Not Any Requests"} />}
        {pendingRequests.length === 0 && checkBox.recieve && (
          <NoFriends msg={"Not Any Recieve Requests"} />
        )}
        {sendRequests.length === 0 && checkBox.send && (
          <NoFriends msg={"Not Any Send Requests"} />
        )}
        {requests?.map((friend: any) => (
          <div
            key={friend.friend}
            className="h-[4rem] w-full flex justify-between items-center px-4 bg-black2 rounded-md"
          >
            <div className="flex gap-4 items-center" key={friend.friend}>
              <div className="h-[3rem] relative w-[3rem]">
                <Avatar
                  src={friend?.profilePic}
                  name={friend?.username}
                  round={true}
                  textSizeRatio={1.75}
                  className="h-full w-full"
                />
              </div>
              <span>{friend.username}</span>
            </div>
            <div className="flex gap-4 items-center">
              {friend.isReq ? (
                <WaitingAcceptRequests
                  friendId={friend.friend}
                  decline={friend.isDecline}
                />
              ) : (
                <AcceptFriendsRequests friendId={friend.friend} />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const NoFriends = ({ msg }: any) => {
  return (
    <div className=" h-full w-full flex justify-center items-center pb-48 uppercase text-white">
      {msg}
    </div>
  );
};
