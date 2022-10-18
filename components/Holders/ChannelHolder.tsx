import React, { useState } from "react";
import tw from "tailwind-styled-components";
import { DownArrow, UpArrow, DeleteIcon, SettingIcon } from "../../Icons/Icons";
import { getServerDetailsById } from "../../libs/server";
import { Code, Chat } from "../../Icons/Icons";

const ChannelHolderComponent = tw.section`
    flex
    flex-col
    items-start
    justify-start
    h-screen
    w-[var(--holders-sidebar-width)]
    min-w-[var(--holders-sidebar-width)]
    max-w-[var(--holders-sidebar-width)]
    bg-black3
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

const ServerHolder = ({ id, setServerComponent, serverComponent }: any) => {
  const [dropDown, setDropDown] = useState(false);
  const [serverDetails, setServerDetails] = useState<any>();

  React.useEffect(() => {
    const init = async () => {
      const { data } = await getServerDetailsById(id);
      console.log(data);
      setServerDetails(data);
    };
    init();
  }, [id]);

  return (
    //@ts-ignore
    <ChannelHolderComponent>
      <ChannelHolderWrapper>
        <div className="flex flex-col w-full">
          <div
            onClick={() => setDropDown(!dropDown)}
            className=" flex w-full h-20 justify-between border-white  items-center cursor-pointer"
          >
            <span className="uppercase">
              {serverDetails?.serverName} Server
            </span>
            {!dropDown ? (
              <span className="h-5 w-5">
                <DownArrow />
              </span>
            ) : (
              <span className="h-5 w-5">
                <UpArrow />
              </span>
            )}
            {/*  A dropdown menu. */}
            <div
              className={`absolute ${
                dropDown ? "scale-100 " : "scale-0"
              } transition-all top-[4.8rem] flex justify-center  items-center w-[85%] h-fit `}
            >
              <div className="w-full  bg-black1 p-4">
                <ul className="flex flex-col w-full gap-2">
                  <li className="w-full cursor-pointer flex gap-3 p-3 bg-black2 text-white rounded-xl">
                    <span className="w-6 h-6">
                      <SettingIcon />
                    </span>
                    Server Settings
                  </li>
                  <li className="w-full cursor-pointer flex gap-3 p-3 bg-black2 text-red-400 rounded-xl">
                    <span className="w-6 h-6">
                      <DeleteIcon />
                    </span>
                    Delete Server
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
          {serverDetails &&
            serverDetails?.channels.map((channel: any) => (
              <ChannelHolder
                channelDetails={channel}
                setServerComponent={setServerComponent}
                serverComponent={serverComponent}
              />
            ))}
        </ServersChannels>
      </ChannelHolderWrapper>
    </ChannelHolderComponent>
  );
};

export default ServerHolder;

const ChannelHolder = ({
  channelDetails,
  setServerComponent,
  serverComponent,
}: any) => {
  React.useEffect(() => {
    if (channelDetails?.channelType === "chat") {
      setServerComponent(channelDetails?.channelId);
    }
  }, []);

  return (
    <>
      <div
        className={`flex rounded-xl ${
          serverComponent === channelDetails?.channelId
            ? "bg-black4"
            : "bg-black"
        } gap-4 cursor-pointer justify-start items-start p-4 w-full`}
        key={channelDetails?.channelId}
        onClick={() => setServerComponent(channelDetails?.channelId)}
      >
        <span
          className={`w-6 h-6 text-white ${
            serverComponent === channelDetails?.channelId
              ? "text-green-500 text-opacity-100"
              : "text-white opacity-40"
          }`}
        >
          {channelDetails?.channelType === "chat" ? <Chat /> : <Code />}
        </span>
        <div
          className={`text-white uppercase flex ${
            serverComponent === channelDetails?.channelId
              ? "text-green-500 text-opacity-100"
              : "text-white opacity-40"
          } `}
        >
          {channelDetails?.channelName}
        </div>
      </div>
    </>
  );
};
