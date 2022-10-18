import React from "react";
import tw from "tailwind-styled-components";
import ServerComponents from "../../../components/ServerComponentsHolder/ServerComponents";
import Index from "../index";

const MainApp = tw(Index)`
    flex
    items-start
    justify-start
    h-screen
    w-full
    relative
    bg-black2
`;

const c = () => {
  return (
    // @ts-ignore
    <MainApp>
      <ServerComponents />
    </MainApp>
  );
};

export default c;
