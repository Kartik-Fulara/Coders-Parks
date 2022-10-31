import React, { useContext, useEffect, useRef } from "react";
import ChannelHolder from "../Holders/ChannelHolder";
import { ServerDataContext } from "../../Context/ContextProvide";

import tw from "tailwind-styled-components";
import CodeComponent from "../Holders/details-servers-holders/CodeComponent";
import ChatComponents from "../Holders/details-servers-holders/ChatComponents";
import { Menu } from "../../Icons/Icons";

import DropDown from "../Elements/DropDown";
import { runCode } from "../../libs/server";

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
  const {
    openConsole,
    setOpenConsole,
    showWhichComponent,
    setLanguage,
    setOpenHolder,
    openHolder,
    language,
    editorData,
    setOutput,
    input,
  } = useContext(ServerDataContext);

  const getOutput = () => {
    let regex = /[\r\n\x0B\x0C\u0085\u2028\u2029]+/g;
    let result = editorData.replace(regex, "\n").replace(/ /g, "\n");
    console.log(result);

    const init = async () => {
      console.log(language, result, input);
      const response = await runCode(result, language, input);
      console.log(response);
    };
    init();
  };

  return (
    <>
      <ChannelHolder />
      {/* @ts-ignore */}
      {showWhichComponent === "chat" ? (
        // @ts-ignore
        <Containers>
          <NavBar>
            <div className="w-full h-full flex justify-start items-center gap-8 ">
              <span
                className="xl:hidden h-5 w-6"
                onClick={() => setOpenHolder(!openHolder)}
              >
                <Menu />
              </span>
              <span className="ml-4 pb-2">Chat Area</span>
            </div>
          </NavBar>
          <TabsComponent>
            <section className="flex h-full w-full flex-col">
              <ChatComponents />
            </section>
          </TabsComponent>
        </Containers>
      ) : (
        // @ts-ignore
        <Containers>
          <NavBar>
            <div className="w-48 h-[80%]">
              <DropDown
                options={languageOption}
                onValue={languageOnValue}
                setFunc={setLanguage}
              />
            </div>
            <div
              className="cursor-pointer h-[80%] w-36 bg-black1 text-center flex justify-center items-center pb-1 rounded-xl uppercase"
              onClick={() => setOpenConsole(!openConsole)}
            >
              {openConsole ? "close" : "open"} Terminal
            </div>
            <div>
              <button
                type="button"
                className="cursor-pointer h-[80%] w-36 bg-black1 text-center flex justify-center items-center pb-1 rounded-xl uppercase"
                onClick={() => getOutput()}
              >
                Run
              </button>
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
