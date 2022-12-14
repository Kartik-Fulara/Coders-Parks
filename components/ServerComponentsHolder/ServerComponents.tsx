import React, { useContext, useEffect, useRef } from "react";
import ChannelHolder from "../Holders/ChannelHolder";
import {
  ServerDataContext,
  UserDataContext,
} from "../../Context/ContextProvide";

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
  { value: "java", on: "java" },
  { value: "javascript", on: "javascript" },
  { value: "python", on: "python" },
  { value: "c", on: "c" },
  { value: "cpp", on: "c++" },
  { value: "csharp", on: "c#" },
];

const language_id = [
  { id: 62, language: "java" },
  { id: 63, language: "javascript" },
  { id: 71, language: "python" },
  { id: 50, language: "c" },
  { id: 54, language: "cpp" },
  { id: 51, language: "c#" },
];

const ServerComponents = () => {
  const [loading, setLoading] = React.useState(true);

  const { userData } = useContext(UserDataContext);

  const {
    currentHost,
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
    const init = async () => {
      setOutput("Loading.....");
      console.log("Clicked");
      const id: any = language_id.find((item) => item.language === language);
      const output = await runCode(editorData, id.id, input);
      // console.log(output);

      const { data } = output;
      if (data === "No Data") {
        setOutput("Something went wrong");
        return;
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
    if (serversData!==undefined &&  serversData?.length <= 0) {
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
                  {currentHost === userData?.id ? (
                    <DropDown
                      options={languageOption}
                      onValue={languageOnValue}
                      setFunc={setLanguage}
                    />
                  ) : (
                    <div className="cursor-pointer h-full w-full bg-black1 text-center flex justify-center items-center pb-1 rounded-md uppercase">
                      {language}
                    </div>
                  )}
                </div>
                <div
                  className="cursor-pointer h-[80%] w-36 bg-black1 text-center flex justify-center items-center pb-1 rounded-xl uppercase"
                  onClick={() => setOpenConsole(!openConsole)}
                >
                  {openConsole ? "close" : "open"} Terminal
                </div>
                {currentHost === userData?.id && (
                  <div className="h-[80%] w-36">
                    <button
                      type="button"
                      className="cursor-pointer h-full w-full bg-black1 text-center flex justify-center items-center pb-1 rounded-xl uppercase"
                      onClick={() => getOutput()}
                    >
                      Run
                    </button>
                  </div>
                )}
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
