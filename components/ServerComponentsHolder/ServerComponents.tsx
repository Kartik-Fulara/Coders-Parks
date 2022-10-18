import React, { useContext, useEffect, useRef } from "react";
import ChannelHolder from "../Holders/ChannelHolder";
import { ServerIdContext } from "../../Context/ServerIdContext";
import tw from "tailwind-styled-components";
import WhiteBoardComponent from "../Holders/details-servers-holders/WhiteBoardComponent";
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

const tabs = ["WhiteBoard", "Editor"];

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

const prev = "java";

const ServerComponents = () => {
  const [selectedTab, setSelectedTab] = React.useState(tabs[0]);
  const { serverId } = useContext(ServerIdContext);
  const [serverComponent, setServerComponent] = React.useState("chat");
  const [selectedColor, setSelectedColor] = React.useState<any>("#000000");
  const [selectedBgColor, setSelectedBgColor] = React.useState<any>("#ffffff");
  const [whiteBoardData, setWhiteBoardData] = React.useState<any>("");
  const [selectedSize, setSelectedSize] = React.useState<any>(5);
  const [code, setCode] = React.useState<string>("");
  const [input, setInput] = React.useState<any>("");
  const [language, setLanguage] = React.useState<string>("java");
  const [theme, setTheme] = React.useState<string>("terminal");
  const [drawing, setDrawing] = React.useState<string>(
    `{"lines":[],"width":400,"height":400}`
  );
  const [openTerminal, setOpenTerminal] = React.useState<boolean>(false);

  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current?.emit("login", { serverId });
      socket.current?.on("liveServer", (data: any) => {
        console.log("live servers", data);
      });
    }
  }, []);

  useEffect(() => {
    console.log(code);
  }, [code]);

  return (
    <>
      <ChannelHolder
        id={serverId}
        serverComponent={serverComponent}
        setServerComponent={setServerComponent}
      />
      {/* @ts-ignore */}
      {serverComponent.split(" ")[0] === "chat" ? (
        // @ts-ignore
        <Containers>
          <ChatComponents serverId={serverId} />
        </Containers>
      ) : (
        // @ts-ignore
        <Containers>
          <NavBar>
            <>
              {selectedTab === "Editor" && (
                <>
                  <div className="w-48">
                    <DropDown
                      options={languageOption}
                      setFunc={setLanguage}
                      onValue={languageOnValue}
                      start={language}
                    />
                  </div>
                  <div
                    className="h-[90%] w-24 bg-black1 text-center flex justify-center items-center pb-1 rounded-xl uppercase"
                    onClick={() => setOpenTerminal(!openTerminal)}
                  >
                    {openTerminal ? "close" : "open"} Terminal
                  </div>
                </>
              )}
              {tabs.map((tab) => (
                <div
                  className={`h-[80%] select-none w-fit p-4 flex justify-center items-center uppercase cursor-pointer ${
                    tab === selectedTab
                      ? "bg-black4 pb-6 text-green-500 rounded-lg shadow-md"
                      : "text-white opacity-50"
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </>
          </NavBar>
          <TabsComponent>
            {selectedTab === "WhiteBoard" ? (
              <section className="flex h-full w-full flex-col">
                <WhiteBoardComponent
                  serverId={serverId}
                  selectedBgColor={selectedBgColor}
                  setSelectedBgColor={setSelectedBgColor}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  socket={socket}
                  drawing={drawing}
                  setDrawing={setDrawing}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                />
              </section>
            ) : (
              <section className="flex h-full w-full flex-col">
                <CodeComponent
                  serverId={serverId}
                  code={code}
                  setCode={setCode}
                  language={language}
                  theme={theme}
                  openTerminal={openTerminal}
                  setInput={setInput}
                />
              </section>
            )}
          </TabsComponent>
        </Containers>
      )}
      ;
    </>
  );
};

export default ServerComponents;
