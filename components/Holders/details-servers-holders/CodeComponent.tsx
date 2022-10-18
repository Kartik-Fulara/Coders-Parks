import React, { useEffect, useRef, useState } from "react";
import EditorComponent from "../../Editors/Editor";
import tw from "tailwind-styled-components";
import DropDown from "../../Elements/DropDown";

const CodeComponent = ({
  serverId,
  code,
  setCode,
  language,
  theme,
  openTerminal,
  setInput,
}: any) => {
  return (
    // @ts-ignore
    <div className="h-full w-full">
      <EditorComponent
        code={code}
        setCode={setCode}
        language={language}
        theme={theme}
        isOpen={openTerminal}
        setInput={setInput}
      />
    </div>
  );
};

export default CodeComponent;
