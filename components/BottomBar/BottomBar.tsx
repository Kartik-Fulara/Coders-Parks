import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import tw from "tailwind-styled-components";
import Image from "next/image";
import {
  ServerDataContext,
  UserDataContext,
} from "../../Context/ContextProvide";
import Avatar from "react-avatar";
import {
  ChatIcon,
  CloseCircle,
  CloseIcon,
  Menu,
  UserIcon,
} from "../../Icons/Icons";
import Link from "next/link";

const BottomNavBar = tw.div`
    flex    
    justify-center
    items-center
    bg-black3
    w-full
    min-h-w-[var(--global-sidebar-width)]
    h-[var(--global-sidebar-width)]
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
      {/* @ts-ignore */}
      <BottomNavBar>
        <div className="h-full w-56 gap-4 bg-transparent outline-none border-none stroke-none select-none flex justify-center items-center">
          <div className="flex  gap-2">
            <IconsHolders
              className="bg-black3 justify-center items-center ml-3"
              onClick={() => setOpenHolder(!openHolder)}
            >
              <div className="h-16 w-[90%] p-2">
                {!openHolder ? <Menu /> : <CloseIcon />}
              </div>
            </IconsHolders>
          </div>
          <div className="flex gap-2 ">
            <Link href="/app/friends">
              <div
                className={`w-10 rounded-xl  overflow-hidden hover:rounded-xl gap-2 flex justify-center items-center h-10 relative group`}
              >
                <UserIcon />
              </div>
            </Link>
          </div>
        </div>
        {!canCreateServer && (
          <ul className="w-fit flex flex-col gap-2">
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
                  </IconsHolders>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {canCreateServer && (
          <div
            className={`w-[10rem] flex justify-center items-center h-[90%] relative group`}
            onClick={() => handleModelOpen()}
          >
            <IconsHolders
              className={`bg-black1 hover:rounded-full p-2 hover:bg-black2 `}
            >
              <Avatar src={`/Asserts/add-button.png`} size="100%" />
            </IconsHolders>
          </div>
        )}
        <div className="h-full w-fit flex justify-center items-center">
          <div className="h-fit w-fit" onClick={() => handleLogOut()}>
            <IconsHolders className="bg-black w-14 justify-center items-center ml-3">
              {logoutLoading ? (
                <>
                  {/* loading  */}
                  <div className="h-10 w-[90%] p-1">
                    <div className="animate-spin rounded-full h-full w-full border-b-2 border-green-600"></div>
                  </div>
                </>
              ) : (
                <div className=" h-[90%] w-full relative">
                  <Image src="/Asserts/logout.svg" alt="logout" fill={true} />
                </div>
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
            </IconsHolders>
          </Link>
        </div>
      </BottomNavBar>
    </>
  );
};

export default BottomBar;
