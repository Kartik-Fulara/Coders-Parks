import React, { useEffect, useRef, useContext } from "react";
import tw from "tailwind-styled-components";
import { ChatIcon, CloseCircle, CloseIcon, Menu } from "../../Icons/Icons";
import { useRouter } from "next/router";
import { ServerDataContext } from "../../Context/ContextProvide";

import DMS_NAME_HOLDER from "./details-chats-holders/ProfileHolder";

import { SingleArrowDown, PeopleIcon } from "../../Icons/Icons";

import DropDown from "../Elements/DropDown";

interface Props {
  $Open: boolean;
}

const FriendsHolderComponent = tw.section<Props>`
    xl:flex
    ${(props: any) => (props.$Open ? "flex absolute" : "hidden")}
    xl:relative
    flex-col
    items-center
    justify-start
    h-screen
    w-[var(--holders-sidebar-width)]
    min-w-[var(--holders-sidebar-width)]
    max-w-[var(--holders-sidebar-width)]
    bg-black3
    overflow-hidden
    z-[51]
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
    cursor-pointer
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

const IconsHolders = tw.div`
    flex
    justify-center
    relative
    items-center
    w-[80%]
    
    h-[3rem]
    pl-[0.05rem]
    rounded-3xl 
    hover:rounded-xl  
    ml-2
    bg-green-500
    text-white
    transition-all
    duration-300
    ease-linear
    cursor-pointer
    group
`;

const FriendsHolder = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const { chats, setChatId, setSearchUserModel, openHolder, setOpenHolder } =
    useContext(ServerDataContext);

  const [dms, setDms] = React.useState([]);

  const [selectedUser, setSelectedUser] = React.useState("friends");
  const [search, setSearch] = React.useState("");
  const [findDms, setFindDms] = React.useState(true);

  const handleClick = (user: any, chatId: any) => {
    setSelectedUser(`${user}`);
    setChatId(chatId);

    router.push(`/app/friends?id=${user}`);
  };

  const options = [
    { value: "DM", label: "Direct Messages" },
    { value: "SU", label: "Search Users" },
  ];

  const onValue = [
    { on: "DM", value: true },
    { on: "SU", value: false },
  ];

  useEffect(() => {
    router.push(`/app/friends`);
  }, [router.isReady]);

  useEffect(() => {
    if (chats.length <= 0) {
      setLoading(true);
    } else {
      setLoading(false);
      setDms(chats);
    }
  }, [chats]);

  useEffect(() => {
    if (search === "") {
      setDms(chats);
    } else {
      const filteredDms = chats.filter((dm: any) => {
        return dm.users.username.toLowerCase().includes(search.toLowerCase());
      });
      // console.log(filteredDms);
      setDms(chats);
    }
  }, [search]);

  return (
    <>
      {/* @ts-ignore */}
      <FriendsHolderComponent $Open={openHolder}>
        <FriendsHolderWrapper>
          <>
            <div className="h-[3rem] w-full">
              <DropDown
                options={options}
                setFunc={setFindDms}
                onValue={onValue}
              />
            </div>
            {findDms ? (
              <SearchHolder>
                <input
                  type="text"
                  placeholder="Search a Direct Message"
                  className="bg-transparent w-full h-full text-white text-opacity-50 text-lg outline-none"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </SearchHolder>
            ) : (
              <SearchHolder>
                <div
                  onClick={() => setSearchUserModel(true)}
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
            {dms?.map((chat: any) => (
              <div
                key={chat?.chatId}
                className={`flex gap-4 w-full h-[4rem] rounded-lg cursor-pointer py-2 px-4 justify-center items-center ${
                  selectedUser === `${chat?.users.id}`
                    ? "bg-black1"
                    : "bg-black2"
                } overflow-y-auto `}
                onClick={() => {
                  handleClick(chat?.users.id, chat?.chatId);
                }}
              >
                <DMS_NAME_HOLDER data={chat?.users} />
              </div>
            ))}
          </DirectMessagesHolder>
        </FriendsHolderWrapper>
      </FriendsHolderComponent>
      <div
        className={`absolute bml:hidden h-full w-full text-white bg-[rgba(0,0,0,0.5)] z-[50] justify-end items-center
      ${openHolder ? "flex" : "hidden"}`}
        onClick={() => setOpenHolder(false)}
      >
        Close
      </div>
    </>
  );
};

export default FriendsHolder;
