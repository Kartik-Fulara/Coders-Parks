import React, { useContext, useEffect, useRef } from "react";
import ChannelHolder from "../Holders/ChannelHolder";
import { ServerDataContext } from "../../Context/ContextProvide";

import tw from "tailwind-styled-components";
import CodeComponent from "../Holders/details-servers-holders/CodeComponent";
import ChatComponents from "../Holders/details-servers-holders/ChatComponents";
import { io } from "socket.io-client";
import DropDown from "../Elements/DropDown";

const Containers = tw.section`
    text-white
    h-full
    w-full
    flex flex-col
    justify-start
    items-center
`;

const NavBar = tw.div`
  bg-black2
  w-full
  h-[var(--friendsDetails-nav-height)]
  flex
  justify-center
  items-center
  gap-4
`;

const TabsComponent = tw.section`
  h-[calc(100%-var(--friendsDetails-nav-height))]
  w-full
  flex
  justify-center
  items-center
`;

const languageOption = [
  { value: "java", label: "Java" },
  { value: "javascript", label: "Javascript" },
  { value: "python", label: "Python" },
  { value: "c", label: "C" },
  { value: "c++", label: "C++" },
  { value: "c#", label: "C#" },
];

const languageOnValue = [
  { on: "java", value: "java" },
  { on: "javascript", value: "javascript" },
  { on: "python", value: "python" },
  { on: "c", value: "c" },
  { on: "c++", value: "c++" },
  { on: "c#", value: "c#" },
];

const ServerComponents = () => {
  const { openConsole, setOpenConsole, showWhichComponent, setLanguage } =
    useContext(ServerDataContext);

  return (
    <>
      <ChannelHolder />
      {/* @ts-ignore */}
      {showWhichComponent === "chat" ? (
        // @ts-ignore
        <Containers>
          <ChatComponents />
        </Containers>
      ) : (
        // @ts-ignore
        <Containers>
          <NavBar>
            <div className="w-48">
              <DropDown
                options={languageOption}
                onValue={languageOnValue}
                setFunc={setLanguage}
              />
            </div>
            <div
              className="h-[90%] w-24 bg-black1 text-center flex justify-center items-center pb-1 rounded-xl uppercase"
              onClick={() => setOpenConsole(!openConsole)}
            >
              {openConsole ? "close" : "open"} Terminal
            </div>
          </NavBar>
          <TabsComponent>
            <section className="flex h-full w-full flex-col">
              <CodeComponent />
            </section>
          </TabsComponent>
        </Containers>
      )}
      ;
    </>
  );
};

export default ServerComponents;
