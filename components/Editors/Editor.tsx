import React, { useState } from "react";
import dynamic from "next/dynamic";
import tw from "tailwind-styled-components";

interface PROPS {
  $isOpen: boolean;
}

const Editor = dynamic(
  async () => {
    const ace = await import("react-ace");
    // All themes
    require("ace-builds/src-noconflict/theme-ambiance");
    require("ace-builds/src-noconflict/theme-chaos");
    require("ace-builds/src-noconflict/theme-chrome");
    require("ace-builds/src-noconflict/theme-cloud9_day");
    require("ace-builds/src-noconflict/theme-cloud9_night");
    require("ace-builds/src-noconflict/theme-cloud9_night_low_color");
    require("ace-builds/src-noconflict/theme-clouds");
    require("ace-builds/src-noconflict/theme-clouds_midnight");
    require("ace-builds/src-noconflict/theme-cobalt");
    require("ace-builds/src-noconflict/theme-crimson_editor");
    require("ace-builds/src-noconflict/theme-dawn");
    require("ace-builds/src-noconflict/theme-dracula");
    require("ace-builds/src-noconflict/theme-dreamweaver");
    require("ace-builds/src-noconflict/theme-eclipse");
    require("ace-builds/src-noconflict/theme-github");
    require("ace-builds/src-noconflict/theme-gob");
    require("ace-builds/src-noconflict/theme-gruvbox");
    require("ace-builds/src-noconflict/theme-gruvbox_dark_hard");
    require("ace-builds/src-noconflict/theme-gruvbox_light_hard");
    require("ace-builds/src-noconflict/theme-idle_fingers");
    require("ace-builds/src-noconflict/theme-iplastic");
    require("ace-builds/src-noconflict/theme-katzenmilch");
    require("ace-builds/src-noconflict/theme-kr_theme");
    require("ace-builds/src-noconflict/theme-kuroir");
    require("ace-builds/src-noconflict/theme-merbivore");
    require("ace-builds/src-noconflict/theme-merbivore_soft");
    require("ace-builds/src-noconflict/theme-mono_industrial");
    require("ace-builds/src-noconflict/theme-monokai");
    require("ace-builds/src-noconflict/theme-nord_dark");
    require("ace-builds/src-noconflict/theme-pastel_on_dark");
    require("ace-builds/src-noconflict/theme-solarized_dark");
    require("ace-builds/src-noconflict/theme-solarized_light");
    require("ace-builds/src-noconflict/theme-sqlserver");
    require("ace-builds/src-noconflict/theme-terminal");
    require("ace-builds/src-noconflict/theme-textmate");
    require("ace-builds/src-noconflict/theme-tomorrow");
    require("ace-builds/src-noconflict/theme-tomorrow_night");
    require("ace-builds/src-noconflict/theme-twilight");
    require("ace-builds/src-noconflict/theme-vibrant_ink");
    require("ace-builds/src-noconflict/theme-xcode");

    // mode
    require("ace-builds/src-noconflict/mode-java");
    require("ace-builds/src-noconflict/mode-python");
    require("ace-builds/src-noconflict/mode-c_cpp");
    require("ace-builds/src-noconflict/mode-golang");
    require("ace-builds/src-noconflict/mode-csharp");
    require("ace-builds/src-noconflict/mode-javascript");

    require("ace-builds/src-noconflict/ext-language_tools");
    return ace;
  },
  {
    loading: () => <>Loading...</>,
    ssr: false,
  }
);

const EditorHolder = tw.div<PROPS>`
    ${(props) => (props.$isOpen ? "h-[calc(100%-25rem)]" : "h-full")}
    w-full
    flex
`;

const TerminalHolder = tw.div<PROPS>`
    ${(props) => (props.$isOpen ? "block" : "hidden")}
    h-[25rem]
    w-full
    flex
    justify-start
    items-start
    bg-gray-800
    p-2
`;

const EditorComponent = ({ code, setCode, theme, language, isOpen }: any) => {
  return (
    <>
      {/* @ts-ignore */}
      <EditorHolder $isOpen={isOpen}>
        <Editor
          style={{ width: "100%", height: "100%" }}
          placeholder="Code Here To Display Others"
          mode={`${language}`}
          theme={`${theme}`}
          name="Code Editor"
          readOnly={false}
          onChange={(val: any) => setCode(val)}
          fontSize={25}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={code}
          setOptions={{
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 5,
          }}
        />
      </EditorHolder>
    </>
  );
};

export default EditorComponent;
