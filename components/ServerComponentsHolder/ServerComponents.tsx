import React, { useContext, useEffect, useRef } from "react";
import ChannelHolder from "../Holders/ChannelHolder";
import { ServerDataContext } from "../../Context/ContextProvide";

import tw from "tailwind-styled-components";
import CodeComponent from "../Holders/details-servers-holders/CodeComponent";
import ChatComponents from "../Holders/details-servers-holders/ChatComponents";


import DropDown from "../Elements/DropDown";
import { runCode } from "../../libs/server";
import toast from "react-hot-toast";

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
  { value: 62, on: "java" },
  { value: 63, on: "javascript" },
  { value: 71, on: "python" },
  { value: 50, on: "c" },
  { value: 54, on: "c++" },
  { value: 51, on: "c#" },
];

const ServerComponents = () => {
  const [loading, setLoading] = React.useState(true);
  const {
    serversData,
    openConsole,
    setOpenConsole,
    showWhichComponent,
    setLanguage,
    language,
    editorData,
    setOutput,
    input,
  } = useContext(ServerDataContext);

  const getOutput = () => {
    if (editorData === "") {
      toast.error("Please write some code");
      return;
    }
    setOutput("Loading.....");
    const init = async () => {
      console.log("Clicked");
      const output = await runCode(editorData, language, input);
      console.log(output);

      const { data } = output;
      if (data === "No Data") {
        setOutput("Something went wrong");
      } else {
        if (data.message && data.stderr) {
          const out =
            data.status.description + "\n" + data.stderr + "\n" + data.message;
          setOutput(out);
        } else if (
          data.status.description === "Compilation Error" &&
          data.compile_output
        ) {
          const out =
            data.status.description +
            "\n" +
            data.compile_output +
            "\n" +
            data.message;
          setOutput(out);
        } else if (data.stdout) {
          setOutput(data.stdout);
        }
      }
    };
    init();
  };

  useEffect(() => {
    if (serversData.length <= 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [serversData]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full w-full relative">
          <div className="text-white">Loading....</div>
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500 absolute"></div>
        </div>
      ) : (
        <>
          <ChannelHolder />
          {/* @ts-ignore */}
          {showWhichComponent === "chat" ? (
            // @ts-ignore
            <Containers>
              <NavBar>
                <div className="w-full h-full flex justify-start items-center gap-8 ">
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
        </>
      )}
    </>
  );
};

export default ServerComponents;
