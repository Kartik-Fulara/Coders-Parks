import React, { useState, useContext, useEffect } from "react";
import tw from "tailwind-styled-components";
import { DownArrow, UpArrow, DeleteIcon, SettingIcon } from "../../Icons/Icons";
import { ServerDataContext } from "../../Context/ContextProvide";
import { Code, Chat, ShareIcon, Menu } from "../../Icons/Icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import Avatar from "react-avatar";

interface Props {
  $Open: boolean;
}

const ChannelHolderComponent = tw.section<Props>`
    xl:flex
    ${(props: any) => (props.$Open ? "flex absolute" : "hidden")}
    xl:relative
    flex-col
    items-start
    justify-start
    h-screen
    w-[var(--holders-sidebar-width)]
    min-w-[var(--holders-sidebar-width)]
    max-w-[var(--holders-sidebar-width)]
    bg-black3
    z-[50]
`;

const ChannelHolderWrapper = tw.div`
    px-6
    gap-8
    flex
    flex-col
    items-start
    justify-start
    h-full
    w-full
    text-white
    text-opacity-50
    bg-transparent
    relative
`;

const ServersChannels = tw.section`
    flex
    flex-col
    items-start
    justify-start
    gap-4
    bg-red-500
    w-full
    h-full
    bg-transparent
    overflow-auto
`;

const ServerHolder = () => {
  const [dropDown, setDropDown] = useState(false);

  const {
    serversData,
    setShowWhichComponent,
    showWhichComponent,
    openHolder,
    setOpenHolder,
  } = useContext(ServerDataContext);

  const [serverId, setServerId] = useState("");
  const [members, setMembers] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    setMembers(serversData.members);

    if (
      serversData.length !== 0 &&
      serversData !== undefined &&
      serversData !== "No Data"
    ) {
      const id = serversData?.serverLinks[0] || "";

      setServerId(id);
    }
  }, [serversData]);

  const handleProfile = (member: any) => {
    setShowProfile(!showProfile);
  };

  return (
    //@ts-ignore
    <ChannelHolderComponent $Open={openHolder}>
      <ChannelHolderWrapper>
        <div className="flex flex-col w-full">
          <div
            onClick={() => setDropDown(!dropDown)}
            className=" flex w-full h-20 justify-between border-white  items-center cursor-pointer"
          >
            <span className="uppercase">{serversData?.serverName} Server</span>
            {!dropDown ? (
              <div className="h-5 w-5">
                <DownArrow />
              </div>
            ) : (
              <div className="h-5 w-5">
                <UpArrow />
              </div>
            )}

            {/*  A dropdown menu. */}
            <div
              className={`absolute z-[100] ${
                dropDown ? "scale-100 " : "scale-0"
              }  transition-all top-[4.8rem] flex justify-center  items-center w-[85%] h-fit `}
            >
              <div className="w-full  bg-black p-4 ">
                <ul className="flex flex-col w-full gap-2 z-20">
                  <li className="w-full cursor-pointer flex gap-3 p-3 bg-black2 text-white rounded-xl z-20">
                    <CopyToClipboard
                      text={serverId}
                      onCopy={() => toast.success("Copied to clipboard")}
                    >
                      <div className="flex gap-4">
                        <span className="w-6 h-6 z-10">
                          <ShareIcon />
                        </span>
                        <span>Share Server Link</span>
                      </div>
                    </CopyToClipboard>
                  </li>
                  <li className="w-full cursor-pointer flex gap-3 p-3 bg-black2 text-white rounded-xl z-20">
                    <span className="w-6 h-6">
                      <SettingIcon />
                    </span>
                    <span className="z-10">Server Settings</span>
                  </li>
                  <li className="w-full cursor-pointer flex gap-3 p-3 bg-black2 text-red-400 rounded-xl z-20 ">
                    <span className="w-6 h-6">
                      <DeleteIcon />
                    </span>
                    <span>Delete Server</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-b-2 border-white border-opacity-40 h-10 w-full uppercase">
            Channels
          </div>
        </div>
        <ServersChannels>
          {serversData &&
            serversData?.channels?.map((channel: any) => (
              <>
                <div
                  className={`flex rounded-xl ${
                    showWhichComponent === channel?.channelType
                      ? "bg-black1"
                      : "bg-black4"
                  } gap-4 cursor-pointer justify-start items-start p-4 w-full z-2`}
                  key={channel?.channelId}
                  onClick={() => setShowWhichComponent(channel?.channelType)}
                >
                  <span
                    className={`w-6 h-6 text-white ${
                      showWhichComponent === channel?.channelType
                        ? "text-green-500 text-opacity-100"
                        : "text-white opacity-40"
                    }`}
                  >
                    {channel?.channelType === "chat" ? <Chat /> : <Code />}
                  </span>
                  <div
                    className={`text-white uppercase flex z-1 ${
                      showWhichComponent === channel?.channelType
                        ? "text-green-500 text-opacity-100"
                        : "text-white opacity-40"
                    } `}
                  >
                    {channel?.channelType === "chat"
                      ? "Chat Area"
                      : "Collab Area"}
                  </div>
                </div>
              </>
            ))}

          {serversData && (
            <div
              className={`flex rounded-xl flex-col gap-4 cursor-pointer justify-start items-start p-4 w-full z-2`}
            >
              <div className="flex gap-4 items-center justify-between w-full">
                <span className=" text-white uppercase">Members</span>
                <span className="text-white ">{members?.length}</span>
              </div>
              <div className="flex gap-4 items-center w-full flex-col">
                {members?.map((member: any) => (
                  <div
                    key={member?.userId}
                    onClick={() => handleProfile(member)}
                    className="w-full h-12 rounded-xl pl-4 items-center justify-start gap-4 flex bg-black2 relative"
                  >
                    <div className="h-10 w-10 p-1">
                      <Avatar
                        name={member?.userName}
                        round={true}
                        size="50"
                        className="w-full h-full"
                        src={member?.userAvatar}
                      />
                    </div>
                    <span className="uppercase">{member?.userName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ServersChannels>
      </ChannelHolderWrapper>
    </ChannelHolderComponent>
  );
};

export default ServerHolder;
