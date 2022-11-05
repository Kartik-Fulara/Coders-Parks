import React, { useEffect, useState, useContext } from "react";
import tw from "tailwind-styled-components";
import Link from "next/link";
import Avatar from "react-avatar";
import { ChatIcon, CloseCircle, CloseIcon, Menu } from "../../Icons/Icons";
import {
  ServerDataContext,
  UserDataContext,
} from "../../Context/ContextProvide";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  $Open: boolean;
}

const Sidebar = tw.div<Props>`
    gap-2
    flex
    
    flex-col
    items-center
    justify-between
    h-screen
    w-[var(--global-sidebar-width)]
    min-w-[var(--global-sidebar-width)]
    relative
    xl:bg-black4
    bg-black3

    text-white
    py-2
    pr-2
`;

const SidebarTop = tw.div`
flex
flex-col
items-center
justify-start
w-full
h-full
overflow-auto
gap-4
`;

const SidebarBottom = tw.div`
  flex
  w-full
  flex-col
  relative
  justify-center
  items-center
  h-fit
  mt-4
  gap-2
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

const SidebarTooltip = tw.span`
  absolute
  w-auto
  p-2
  m-2
  min-w-max
  left-16
  rounded-md
  shadow-md
  text-white
  bg-black
  z-10
  whitespace-nowrap
  font-bold
  transition-all
  duration-200
  scale-0
  origin-left
  flex
  justify-center
  items-center
  group-hover:scale-100
`;

const SideBar = ({ handleModelOpen, handleLogOut, setId }: any) => {
  const [focus, setFocus] = useState("0");
  const [canCreateServer, setCanCreateServer] = useState(true);
  
  const {
    sideBarServers,
    setSelectedServerId,
    openHolder,
    setOpenHolder,
    logoutLoading,
  } = useContext(ServerDataContext);
  const { userData } = useContext(UserDataContext);

  const router = useRouter();

  const handleClick = (id: any) => {
    setFocus(id);
    setSelectedServerId(id);
  };

  useEffect(() => {
    if (sideBarServers?.length >= 1) {
      setCanCreateServer(false);
    }
  }, [sideBarServers]);

  useEffect(() => {
    if (router.query.id && router.pathname === "/app/channel/c") {
      setFocus(`${router?.query?.id}`);
    }
  }, [router.isReady]);

  return (
    <>
      {/* @ts-ignore*/}
      <Sidebar $Open={openHolder}>
        <SidebarTop>
          <div
            key={"0"}
            onClick={() => setFocus("0")}
            className="w-full rounded-3xl hover:rounded-xl flex justify-center items-center h-fit relative group"
          >
            <Link href="/app/friends" onClick={() => setFocus("0")}>
              <div
                className={`w-full ${
                  focus === "0" ? "rounded-xl" : "rounded-3xl"
                } overflow-hidden hover:rounded-xl gap-2 flex justify-center items-center h-fit relative group`}
              >
                <div
                  className={`absolute  left-0 bg-white w-1  group-hover:h-[80%] ${
                    focus === "0" ? "h-[80%]" : "h-[30%]"
                  } transition-all `}
                ></div>
                <IconsHolders
                  className={`${
                    focus === "0" ? "rounded-xl" : "rounded-3xl"
                  } overflow-hidden
              p-2
              `}
                >
                  <ChatIcon />
                </IconsHolders>
              </div>
            </Link>
          </div>
          <div className=" w-[80%] bg-white h-[0.05rem]"></div>
          {!canCreateServer && (
            <ul className="w-full flex flex-col gap-2">
              {sideBarServers?.map((item: any) => (
                <li
                  key={item.serverId}
                  onClick={() => handleClick(item.serverId)}
                  className="w-full   rounded-3xl  hover:rounded-xl gap-4 flex justify-center items-center h-fit relative group"
                >
                  <Link
                    href={`/app/channel/c?id=${item.serverId}`}
                    className="w-full h-fit flex justify-center items-center"
                  >
                    <div
                      className={`absolute  left-0 bg-white w-1  group-hover:h-[80%] ${
                        focus === item.serverId ? "h-[80%]" : "h-[30%]"
                      } transition-all `}
                    ></div>
                    <IconsHolders
                      className={`${
                        focus === item.serverId ? "rounded-xl" : "rounded-3xl"
                      } bg-black1 overflow-hidden`}
                    >
                      <Avatar
                        size="100%"
                        color="rgba(0, 0, 0, 0)"
                        name={`${item.serverName}`}
                        src={`${item?.serverImage}`}
                      />
                      <SidebarTooltip>
                        <span className="text-green-500 text-xl">
                          {item.serverName}
                        </span>
                      </SidebarTooltip>
                    </IconsHolders>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {canCreateServer && (
            <div
              className={`w-full flex justify-center items-center h-fit relative group`}
              onClick={() => handleModelOpen()}
            >
              <IconsHolders
                className={`bg-black1 hover:rounded-full p-2 hover:bg-black2 `}
              >
                <Avatar src={`/Asserts/add-button.png`} size="100%" />
              </IconsHolders>
            </div>
          )}
        </SidebarTop>
        <SidebarBottom>
          {/* @ts-ignore */}
          <IconsHolders
            className="bg-black1  justify-center items-center ml-3 xl:hidden"
            onClick={() => setOpenHolder(!openHolder)}
          >
            <div className="h-10 w-[90%] p-1">
              {!openHolder ? <Menu /> : <CloseIcon />}
            </div>
          </IconsHolders>
          <div className="h-fit w-full" onClick={() => handleLogOut()}>
            <IconsHolders className="bg-black justify-center items-center ml-3">
              {logoutLoading ? (
                <>
                  {/* loading  */}
                  <div className="h-10 w-[90%] p-1">
                    <div className="animate-spin rounded-full h-full w-full border-b-2 border-green-600"></div>
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src="/Asserts/logout.svg"
                    height={100}
                    alt="logout"
                    className="p-2 pl-3"
                    width={100}
                  />
                  <SidebarTooltip>
                    <span className="text-green-500 text-xl">Logout</span>
                  </SidebarTooltip>
                </>
              )}
            </IconsHolders>
          </div>
          <Link
            href={`/app/profile?id=${userData?.id}`}
            className="h-fit w-full rounded-3xl hover:rounded-xl flex justify-center items-center relative group"
            onClick={() => setFocus(userData?.id)}
          >
            <IconsHolders
              className={`${
                focus === userData?.id ? "rounded-xl" : "rounded-3xl"
              } bg-black1 overflow-hidden`}
            >
              <Avatar
                size="100%"
                color="rgba(0, 0, 0, 0)"
                name={`${userData?.username}`}
                src={`${userData?.profileImage}`}
              />
              <SidebarTooltip>
                <span className="text-green-500 text-xl">
                  {userData?.username}
                </span>
              </SidebarTooltip>
            </IconsHolders>
          </Link>
        </SidebarBottom>
      </Sidebar>
    </>
  );
};

export default SideBar;
