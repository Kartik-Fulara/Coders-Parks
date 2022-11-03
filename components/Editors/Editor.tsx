import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import tw from "tailwind-styled-components";
import { ServerDataContext } from "../../Context/ContextProvide";

interface PROPS {
  $isOpen: boolean;
}

const Editor = dynamic(
  async () => {
    const ace = await import("react-ace");
    // All themes
    require("ace-builds/src-noconflict/theme-terminal");
    // mode
    require("ace-builds/src-noconflict/mode-java");
    require("ace-builds/src-noconflict/mode-python");
    require("ace-builds/src-noconflict/mode-c_cpp");
    require("ace-builds/src-noconflict/mode-golang");
    require("ace-builds/src-noconflict/mode-csharp");
    require("ace-builds/src-noconflict/mode-javascript");

    require("ace-builds");
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
    bg-black4
    p-4
    flex-col
    gap-4
`;

const EditorComponent = () => {
  const [inputField, setInputField] = useState(false);

  const { editorData, setEditorData, language, openConsole, setInput, output } =
    React.useContext(ServerDataContext);

  useEffect(() => {
    console.log(output);
  }, [output]);

  return (
    <>
      {/* @ts-ignore */}
      <EditorHolder $isOpen={openConsole}>
        <Editor
          style={{ width: "100%", height: "100%" }}
          placeholder="Code Here To Display Others"
          mode={`${language}`}
          theme="terminal"
          name="Code Editor"
          readOnly={false}
          onChange={(val: any) => setEditorData(val)}
          fontSize={25}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={editorData}
          setOptions={{
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 5,
          }}
          onCopy={(input) => console.log(input)}
        />
      </EditorHolder>
      {openConsole && (
        // @ts-ignore
        <TerminalHolder $isOpen={openConsole}>
          <div className="w-full h-12 flex justify-start items-center gap-5">
            <span
              className={`${
                inputField
                  ? "cursor-pointer bg-black1 h-full w-fit p-2"
                  : "cursor-pointer"
              }
              select-none text-2xl`}
              onClick={() => setInputField(true)}
            >
              Input
            </span>
            <span
              className={`${
                !inputField
                  ? "bg-black1 cursor-pointer h-full w-fit p-2"
                  : "cursor-pointer"
              }
              select-none
              text-2xl `}
              onClick={() => setInputField(false)}
            >
              Output
            </span>
          </div>
          {inputField ? (
            <InputField setInput={setInput} />
          ) : (
            <Output output={output} />
          )}
        </TerminalHolder>
      )}
    </>
  );
};

export default EditorComponent;

const InputField = ({ setInput }: any) => {
  return (
    <textarea
      className="h-full w-full bg-black p-4 outline-none border-none resize-none text-white"
      placeholder="Input Here"
      onChange={(e: any) => setInput(e.target.value)}
    ></textarea>
  );
};

const Output = ({ output }: any) => {
  return (
    <div className="h-full w-full bg-black p-4 outline-none whitespace-pre-wrap border-none resize-none text-white">
      {output || "Output Will Be Displayed Here"}
    </div>
  );
};
