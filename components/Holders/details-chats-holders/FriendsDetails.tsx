import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import {
  getFriends,
  getPendingFriends,
  queryUserById,
} from "../../../libs/chats";
import { Refresh } from "../../../Icons/Icons";
import Avatar from "react-avatar";
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
`;

const FriendsDetails = ({
  token,
  recieveReq,
  setRecieveReq,
  setSendRe,
}: any) => {
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
            className={`uppercase cursor-pointer select-none text-white w-16  text-center text-opacity-70 ${
              !pending &&
              "bg-black h-[60%] rounded-lg text-opacity-100 pt-[0.09rem]"
            }`}
          >
            All
          </span>
          <span
            onClick={() => {
              setIsPending(true);
              setRecieveReq(false);
            }}
            className={`uppercase cursor-pointer select-none text-white w-32 text-center text-opacity-70 ${
              pending &&
              "bg-black h-[60%] rounded-lg text-opacity-100 pt-[0.09rem] "
            }`}
          >
            Pending
          </span>
        </div>
      </NavBar>
      {pending ? (
        <DisplayPendingFriends
          token={token}
          recieveReq={recieveReq}
          setRecieveReq={setRecieveReq}
          setSendRe={setSendRe}
        />
      ) : (
        <DisplayAllFriends token={token} />
      )}
    </div>
  );
};

export default FriendsDetails;

const DisplayAllFriends = ({ token }: any) => {
  const [friends, setFriends] = useState<any>([]);
  const getAllFriends = async () => {
    const { data } = await getFriends(token);
    if (data.message === "No friends found") {
      setFriends([]);
      console.log("No friends found");
    } else {
      console.log(data);
    }
  };

  useEffect(() => {
    getAllFriends();
  }, [token]);

  return (
    <div className="h-[calc(100%-var(--friendsDetails-nav-height))] w-full flex flex-col gap-4 text-white">
      {friends.length === 0 && (
        <NoFriends msg={`No Friends! Why Don't You Search new Friends `} />
      )}
      {friends?.map((friend: any) => (
        <div className="h-[4rem] w-full flex justify-between items-center px-4 bg-black2">
          <div className="flex gap-4 items-center">
            <div className="h-[3rem] w-[3rem]">
              <Avatar
                src={friend?.profilePic}
                name={friend?.username}
                round={true}
                textSizeRatio={1.75}
              />
            </div>
            <span>{friend.username}</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-red-500 hover:text-opacity-100 text-opacity-50">
              Remove
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const DisplayPendingFriends = ({
  token,
  recieveReq,
  setRecieveReq,
  setSendRe,
}: any) => {
  const [friends, setFriends] = useState<any>([]);
  let previous: any[] = [];
  const getFriends = async () => {
    const { data } = await getPendingFriends(token);
    if (data?.message === "No Pending Requests found") {
      setFriends([]);
    } else {
      data?.map(async (request: any) => {
        const { data } = await queryUserById(request.sendBy);
        const req = data.data.data;
        if (!previous.includes(request.sendBy) && req.friend === req.sendBy) {
          previous.push(request.sendBy);
          if (!friends.includes(req)) {
            setFriends((prev: any) => [...prev, req]);
          }
        }
      });
    }
  };

  useEffect(() => {
    setFriends([]);
    getFriends();
  }, [token]);

  useEffect(() => {
    if (!recieveReq && previous.length !== 0) {
      setFriends([]);
      previous = [];
    }
  }, [recieveReq]);

  return (
    <>
      {recieveReq && (
        <Toast
          getFriends={getFriends}
          setRecieveReq={setRecieveReq}
          setSendRe={setSendRe}
        />
      )}
      <div className="h-[calc(100%-var(--friendsDetails-nav-height))] w-full flex flex-col gap-4 p-4 text-white">
        {friends.length === 0 && <NoFriends msg={"Not Any Pending Requests"} />}
        {friends?.map((friend: any) => (
          <div
            key={friend.id}
            className="h-[4rem] w-full flex justify-between items-center px-4 bg-black2"
          >
            <div className="flex gap-4 items-center">
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
              <span className="text-red-500 hover:text-opacity-100 text-opacity-50">
                Remove
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const Toast = ({ getFriends, setRecieveReq, setSendRe }: any) => {
  const [isHover, setIsHover] = useState(false);

  const handleAccept = () => {
    setSendRe(false);
    setRecieveReq(false);
    getFriends();
  };

  return (
    <div
      className="absolute top-4 right-4 h-24 w-[25rem] cursor-pointer"
      onClick={() => handleAccept()}
    >
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => handleAccept()}
        className={`h-full w-full rounded-lg flex justify-center items-center gap-5 cursor-pointer ${
          isHover ? "bg-black1" : "bg-black"
        } `}
      >
        <span className="text-white text-lg font-medium cursor-pointer select-none">
          Click to see the Recent Request
        </span>
        <button
          onClick={() => handleAccept()}
          className={`h-14 w-14 p-4 rounded-lg text-lg font-medium cursor-pointer ${
            isHover ? "bg-black text-green-500" : "text-white"
          }`}
        >
          <Refresh />
        </button>
      </div>
    </div>
  );
};

const NoFriends = ({ msg }: any) => {
  return (
    <div className="h-full w-full flex justify-center items-center text-white">
      {msg}
    </div>
  );
};
