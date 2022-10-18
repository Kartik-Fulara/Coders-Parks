import React, { useRef, useEffect } from "react";
import tw from "tailwind-styled-components";
import CanvasDraw from "react-canvas-draw";
import { io } from "socket.io-client";

const ToolsContainer = tw.div`
  w-full
  p-4
  flex
  justify-start
  items-center
  gap-4
`;

const WhiteBoardComponent = ({
  serverId,
  setSelectedColor,
  setSelectedBgColor,
  selectedColor,
  selectedBgColor,
  setDrawing,
  drawing,
  selectedSize,
  setSelectedSize,
  socket,
}: any) => {
  const canvasRef = useRef<any>(null);

  const savedData = () => {};

  useEffect(() => {
    if (socket.current) {
      canvasRef.current?.loadSaveData(drawing, true);
    }
  }, [drawing]);

  const loadData = () => {
    const data = canvasRef.current?.getSaveData();
    const timeOut = setTimeout(() => {
      socket.current?.emit("whiteboard-data", {
        serverId,
        data,
      }),
        1000;
    });

    socket.current?.on("receive", (data: any) => {
      console.log("data", data);
    });

    return () => {
      clearTimeout(timeOut);
    };
  };

  const ClearBoard = () => {
    canvasRef.current.clear();
    loadData();
  };

  return (
    <>
      {/*  @ts-ignore */}

      <ToolsContainer>
        <div className="flex h-10 w-fit  justify-center items-center gap-4">
          <div className="flex gap-4 justify-center items-center">
            <label htmlFor="color" className="text-xl cursor-pointer">
              COLOR
            </label>
            <div className="h-10 w-10 rounded-3xl overflow-hidden">
              <input
                id="color"
                type="color"
                value={selectedColor}
                onChange={(e: any) => setSelectedColor(e.target.value)}
                className="h-full w-full border-none outline-none cursor-pointer"
              />
            </div>
          </div>
          <span
            className={`text-white bg-black text-xl p-2 pb-3 rounded-xl flex justify-center items-center h-full w-fit`}
          >
            {selectedColor}
          </span>
        </div>
        <div className="flex h-10 w-fit  justify-center items-center gap-4">
          <div className="flex gap-4 justify-center items-center">
            <label htmlFor="bgcolor" className="text-xl cursor-pointer">
              BACKGROUND COLOR
            </label>
            <div className="h-10 w-10 rounded-3xl overflow-hidden">
              <input
                id="bgcolor"
                type="color"
                value={selectedBgColor}
                onChange={(e: any) => setSelectedBgColor(e.target.value)}
                className="h-full w-full border-none outline-none cursor-pointer"
              />
            </div>
          </div>
          <span
            className={`text-white bg-black text-xl p-2 pb-3 rounded-xl flex justify-center items-center h-full w-fit`}
          >
            {selectedBgColor}
          </span>
        </div>
        <div className="flex h-10 w-fit  justify-center items-center gap-4">
          <button
            className={`h-10 w-fit   bg-black text-white text-xl p-2 pb-3 rounded-xl flex justify-center items-center`}
            onClick={() => ClearBoard()}
          >
            Clear
          </button>
        </div>
        <div className="flex h-10 w-fit  justify-center items-center gap-4">
          <button
            className={`h-10 w-fit   bg-black text-white text-xl p-2 pb-3 rounded-xl flex justify-center items-center`}
            onClick={() => savedData()}
          >
            SaveData
          </button>
        </div>
        <div className="flex h-10 w-fit  justify-center items-center gap-4">
          <button
            className={`h-10 w-fit   bg-black text-white text-xl p-2 pb-3 rounded-xl flex justify-center items-center`}
            onClick={() => loadData()}
          >
            LoadData
          </button>
        </div>
      </ToolsContainer>
      <CanvasDraw
        ref={canvasRef}
        brushColor={selectedColor}
        brushRadius={2}
        lazyRadius={0}
        hideGrid={true}
        hideInterface={true}
        catenaryColor={"#ffffff"}
        disabled={false}
        imgSrc={""}
        saveData={""}
        immediateLoading={true}
        className="h-full w-full"
        backgroundColor={selectedBgColor}
        enablePanAndZoom={true}
        onChange={() => loadData()}
      />
    </>
  );
};

export default WhiteBoardComponent;
