import React, { useEffect, useRef } from "react";
import tw from "tailwind-styled-components";
import Avatar from "react-avatar";
import { useRouter } from "next/router";
import { userDetails, queryUserById } from "../../libs/chats";
import toast from "react-hot-toast";
import DMS_NAME_HOLDER from "./details-chats-holders/ProfileHolder";

import {
  SingleArrowDown,
  PeopleIcon,
  SingleArrowUp,
  DeleteIcon,
  CallCut,
  MicroPhone,
  SettingIcon,
} from "../../Icons/Icons";

import { logout } from "../../libs/auth";
import SearchUser from "../../models/SearchUser";
import DropDown from "../Elements/DropDown";

const FriendsHolderComponent = tw.section`
    flex
    flex-col
    items-center
    justify-start
    h-screen
    w-[var(--holders-sidebar-width)]
    min-w-[var(--holders-sidebar-width)]
    max-w-[var(--holders-sidebar-width)]
    bg-black3
    overflow-hidden
`;

const FriendsHolderWrapper = tw.div`
    py-4
    px-6
    gap-5
    flex
    flex-col
    items-start
    justify-start
    w-full
    h-[calc(100%-4rem)]
    text-white
    text-opacity-50
    bg-transparent
    relative
`;

const SearchHolder = tw.div`
    flex
    bg-black2
    justify-center
    items-start
    w-full
    h-[3rem]
    rounded-[10px]
    px-4
    pb-[0.05rem]
    text-white
    text-opacity-50
    relative
`;

const DirectMessagesHolder = tw.div`
  flex
  flex-col
  items-start
  justify-between
  gap-4
  w-full
  max-h-[85%]
  bg-transparent
  overflow-auto
`;

const UserInfoHolder = tw.div`
    flex
    w-full
    h-[4rem]
    p-4
    bg-black2
    justify-between
    items-center
`;

const FriendsBtn = tw.div`
    flex
    w-full
    h-[4rem]
    p-4
    text-white
    text-opacity-50
    bg-black2
    justify-start
    gap-4
    items-center
    rounded-[10px]
    cursor-pointer
    hover:bg-black1
`;

const FriendsHolder = ({
  data,
  recieveMsg,
  handleLoading,
  getUid,
  setSendReq,
}: any) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = React.useState([]);
  const [chats, setChats] = React.useState([]);

  const [selectedUser, setSelectedUser] = React.useState("friends");

  const socket = useRef<any>();

  const [openModel, setOpenModel] = React.useState(false);
  const [findDms, setFindDms] = React.useState(true);

  const chatData = async () => {
    const { data: userData } = await userDetails(data);

    if (userData && userData.status === "Ok") {
      setUserInfo(userData.data);
      setChats(userData.data.chats);
    } else {
      console.log(userData);
    }
  };

  React.useEffect(() => {
    if (data !== undefined) {
      chatData();
    }
  }, [data && router.isReady]);

  const handleClick = (user: any) => {
    setSelectedUser(`${user}`);
    getUid(user);
    router.push(`/app/friends?id=${user}`);
  };

  useEffect(() => {
    handleLoading();
  }, [selectedUser]);

  const handleModelClose = () => {
    setOpenModel(false);
  };

  const handleModelOpen = () => {
    setOpenModel(true);
  };

  const handleCall = () => {
    chatData();
  };

  useEffect(() => {
    if (recieveMsg) {
      const { senderId } = recieveMsg;
      console.log(senderId);
      const dd = chats.findIndex((item: any) => item.users[0] === senderId);
      if (dd < 0) {
        chatData();
      }
      console.log(recieveMsg);
    }
  }, [recieveMsg]);

  const options = [
    { value: "DM", label: "Direct Messages" },
    { value: "SU", label: "Search Users" },
  ];

  const onValue = [
    { on: "DM", value: true },
    { on: "SU", value: false },
  ];

  return (
    <>
      {/* @ts-ignore */}
      <FriendsHolderComponent>
        <FriendsHolderWrapper>
          <>
            <DropDown
              options={options}
              setFunc={setFindDms}
              onValue={onValue}
            />
            {findDms ? (
              <SearchHolder>
                <input
                  type="text"
                  placeholder="Search a Direct Message"
                  className="bg-transparent w-full h-full text-white text-opacity-50 text-lg outline-none"
                />
              </SearchHolder>
            ) : (
              <SearchHolder>
                <div
                  onClick={handleModelOpen}
                  className="bg-transparent w-full h-full text-white text-opacity-50 text-lg outline-none text-center flex justify-center items-center"
                >
                  Search a User
                </div>
              </SearchHolder>
            )}
          </>
          <FriendsBtn
            className={`${
              selectedUser === "friends" ? "bg-black1" : "bg-black2"
            }`}
            onClick={() => {
              setSelectedUser("friends");
              router.push("/app/friends");
            }}
          >
            <span className="h-10 w-10">
              <PeopleIcon />
            </span>
            <span className="text-white text-opacity-50 text-lg">Friends</span>
          </FriendsBtn>
          <div className="flex flex-col justify-center items-start w-full gap-2">
            <div className="flex gap-4 w-full justify-between items-end">
              Direct Messages
              <span className="w-6 h-6">
                <SingleArrowDown />
              </span>
            </div>
            <div className="w-full h-[0.1rem] opacity-30 bg-white "></div>
          </div>
          <DirectMessagesHolder>
            {chats?.map((chat: any) => (
              <div
                key={chat?.chatId}
                className={`flex gap-4 w-full h-[4rem] rounded-lg cursor-pointer py-2 px-4 justify-center items-center ${
                  selectedUser === `${chat?.users[0]}`
                    ? "bg-black1"
                    : "bg-black2"
                } overflow-y-auto `}
                onClick={() => {
                  handleClick(chat?.users[0]);
                }}
              >
                <DMS_NAME_HOLDER id={chat?.users[0]} />
              </div>
            ))}
          </DirectMessagesHolder>
        </FriendsHolderWrapper>
      </FriendsHolderComponent>
      {openModel && (
        <SearchUser
          handleModelClose={handleModelClose}
          handleCall={handleCall}
          setSendReq={setSendReq}
        />
      )}
    </>
  );
};

export default FriendsHolder;
