import React from "react";
import tw from "tailwind-styled-components";
import {
  ServerDataContext,
  UserDataContext,
} from "../../Context/ContextProvide";
import { ChatIcon, CloseCircle, CloseIcon, Menu } from "../../Icons/Icons";
import Link from "next/link";

const BottomNavBar = tw.div`
    flex
    flex-row
    justify-between
    items-center
    bg-black3
    w-full
    min-h-w-[var(--global-sidebar-width)]
    h-[var(--global-sidebar-width)]
`;

const BottomNavBarLeft = tw.div`
    flex
    flex-row
    items-center
    justify-center
    w-full
    h-full
    text-white
`;

const BottomNavBarRight = tw.div`
    flex
    flex-row
    items-center
    justify-center
    w-full
    h-full
    text-white
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

const BottomBar = ({ handleModelOpen, handleLogOut }: any) => {
  const {
    sideBarServers,
    setSelectedServerId,
    openHolder,
    setOpenHolder,
    logoutLoading,
  } = React.useContext(ServerDataContext);
  const { userData } = React.useContext(UserDataContext);
  return (
    <>
      {/* @ts-ignore */}
      <BottomNavBar>
        <BottomNavBarLeft>
          <div className="flex  gap-2">
            <IconsHolders
              className="bg-black1  justify-center items-center ml-3"
              onClick={() => setOpenHolder(!openHolder)}
            >
              <div className="h-10 w-[90%] p-1">
                {!openHolder ? <Menu /> : <CloseIcon />}
              </div>
            </IconsHolders>
          </div>
          <div className="flex gap-2">
            <Link href="/app/friends">
              <div
                className={`w-full rounded-xl overflow-hidden hover:rounded-xl gap-2 flex justify-center items-center h-fit relative group`}
              >
                <div
                  className={`absolute h-[80%] left-0 bg-white w-1 md:flex group-hover:h-[80%] hidden  transition-all `}
                ></div>
                <IconsHolders
                  className={`rounded-xl  overflow-hidden
              p-2
              `}
                >
                  <ChatIcon />
                </IconsHolders>
              </div>
            </Link>
          </div>
        </BottomNavBarLeft>
        <BottomNavBarRight>Hmm</BottomNavBarRight>
      </BottomNavBar>
    </>
  );
};

export default BottomBar;
