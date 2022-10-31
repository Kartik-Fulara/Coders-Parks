import React, { useContext, useEffect } from "react";
import tw from "tailwind-styled-components";
import { CloseCircle, ImageIcon } from "../Icons/Icons";
import Avatar from "react-avatar";
import { createServer, joinServer, searchServer } from "../libs/server";
import { UserDataContext } from "../Context/ContextProvide";
import toast from "react-hot-toast";
import { userDetails } from "../libs/chats";

const CreateServerModelComponent = tw.section`
    absolute
    flex
    flex-col
    items-center
    justify-center
    h-screen
    z-10
    w-screen
    bg-[rgba(0,0,0,0.5)]
`;

const CreateServerModelWrapper = tw.div`
    flex
    flex-col
    items-center
    justify-center
    w-[30rem]
    h-[33rem]
    bg-black4
    text-white
`;

const CreateNewServer = ({ handleModelClose, setCall, id }: any) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = React.useState<File>();

  const { userData } = useContext(UserDataContext);

  const [isServer, setIsServer] = React.useState(true);

  const [serverDetail, setServerDetail] = React.useState({
    name: "",
    serverImage: "",
  });

  React.useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setServerDetail({
          ...serverDetail,
          serverImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setServerDetail({
        ...serverDetail,
        serverImage: "",
      });
    }
  }, [file]);

  const handleSubmit = () => {
    const serverName = serverDetail.name.trim();
    const serverImage = serverDetail.serverImage;
    const init = async () => {
      const image = userData?.profileImage || "";
      const username = userData?.username;
      console.log(username);
      const response = await createServer(
        id,
        username,
        image,
        serverName,
        serverImage
      );
      if (response) {
        setCall(true);
        handleModelClose();
      }
    };
    init();
  };

  const checkFileType = (event: any) => {
    const file = event.target.files[0];

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (validTypes.indexOf(file.type) === -1) {
      setFile(undefined);
    }

    setFile(file);
  };

  return (
    // @ts-ignore
    <CreateServerModelComponent>
      <CreateServerModelWrapper>
        <div className="w-full h-[4rem] flex justify-end items-center p-4">
          <button
            type="button"
            aria-label="close"
            onClick={handleModelClose}
            className="h-10 w-10"
          >
            <CloseCircle />
          </button>
        </div>
        <div className="h-full w-full flex flex-col gap-4">
          <div className="w-full h-5 flex justify-center items-center gap-4">
            <button
              type="button"
              aria-label="create a new server"
              className={`${
                isServer ? `bg-black1 opacity-100` : `opacity-50`
              }  w-fit p-2 cursor-pointer`}
              onClick={() => setIsServer(true)}
            >
              Create a Server
            </button>
            <button
              type="button"
              aria-label="join a new server"
              className={`${
                !isServer ? `bg-black1 opacity-100` : `opacity-50`
              }  w-fit p-2 cursor-pointer`}
              onClick={() => setIsServer(false)}
            >
              Join a Server
            </button>
          </div>
          {isServer ? (
            <CREATE_A_NEW_SERVER
              fileInputRef={fileInputRef}
              checkFileType={checkFileType}
              serverDetail={serverDetail}
              setServerDetail={setServerDetail}
              handleSubmit={handleSubmit}
            />
          ) : (
            <JOIN_A_NEW_SERVER />
          )}
        </div>
      </CreateServerModelWrapper>
    </CreateServerModelComponent>
  );
};

export default CreateNewServer;

const CREATE_A_NEW_SERVER = ({
  fileInputRef,
  checkFileType,
  serverDetail,
  setServerDetail,
  handleSubmit,
}: any) => (
  <>
    <div className="h-[4rem] w-full flex justify-center items-center flex-col">
      <h1 className="text-2xl font-bold">Create New Server</h1>
      <p className="text-white opacity-50">Give your Server a Name and Image</p>
    </div>
    <section className="flex w-full flex-col justify-center gap-10 items-center">
      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*"
        onChange={(e: any) => checkFileType(e)}
      />
      <div className="relative">
        <Avatar
          onClick={() => {
            fileInputRef.current?.click();
          }}
          name={serverDetail.name}
          src={
            serverDetail.name ||
            (!serverDetail.name && serverDetail.serverImage !== "")
              ? serverDetail.serverImage !== ""
                ? serverDetail.serverImage
                : ""
              : "/Asserts/Insertimage.png"
          }
          className="cursor-pointer"
          round={true}
          size="8rem"
        />
        <div className="absolute bottom-3 right-1">
          <button
            aria-label="upload image"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="h-10 w-10 flex justify-center items-center rounded-full bg-black1  text-blue-500"
          >
            <div className="h-8 w-8">
              <ImageIcon />
            </div>
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Server Name"
        className="w-[20rem] h-[2.5rem] rounded-md bg-black1 text-white p-2"
        value={serverDetail.name}
        onChange={(e) =>
          setServerDetail({ ...serverDetail, name: e.target.value })
        }
      />

      <button
        type="submit"
        className="w-[20rem] h-[2.5rem] rounded-md bg-blue-500 text-white p-2"
        onClick={() => handleSubmit()}
      >
        Create Server
      </button>
    </section>
  </>
);

const JOIN_A_NEW_SERVER = () => {
  const { userData } = useContext(UserDataContext);
  const [serverId, setServerId] = React.useState(null);
  const [serverDetail, setServerDetail] = React.useState([]);
  const fetchServerData = () => {
    const init = async () => {
      if (serverId !== "" && serverId !== null && serverId !== undefined) {
        const response = await searchServer(serverId);
        console.log(response);
        if (response.data.length !== 0 && response.data !== "No Data") {
          console.log(response.data);
          setServerDetail(response.data);
        } else {
          setServerDetail([]);
          setServerId(null);
        }
      } else {
        setServerDetail([]);
        setServerId(null);
      }
    };
    init();
  };

  const handleJoinServer = () => {
    const init = async () => {
      const response = await joinServer(
        serverDetail?.serverId,
        serverDetail?.serverName,
        serverDetail?.serverImage,
        userData?.profileImage,
        userData?.username
      );
      console.log(response);
      if (response.data.message === "Joined Server") {
        toast.success("Joined Server");
      } else {
        toast.error("Something went wrong");
      }
    };
    init();
  };

  return (
    <div className="h-[4rem] w-full flex justify-center items-center flex-col">
      <div className="flex flex-col w-full h-full justify-start items-center gap-6 ">
        <form
          className="flex w-full justify-center gap-4  items-center"
          onSubmit={(e) => {
            e.preventDefault();
            fetchServerData();
          }}
        >
          <input
            type="text"
            placeholder="Enter Server Link ID"
            className="h-10 w-[20rem] bg-black1 rounded-lg text-white text-lg font-medium px-4"
            onChange={(e: any) => setServerId(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {serverDetail.length !== 0 ? (
          <div className="flex w-[90%] justify-between p-4 items-center  h-fit bg-black2 rounded-3xl">
            <div className="w-full h-full flex gap-4 items-center justify-start">
              <Avatar
                name={serverDetail?.serverName}
                size="50"
                round={true}
                src={serverDetail?.serverImage}
              />
              <span className="text-white text-opacity-80">
                {serverDetail?.serverName}
              </span>
            </div>
            <div className="flex gap-4">
              <button
                aria-label="Start Chat"
                type="button"
                className="bg-blue-700 text-white font-bold rounded-3xl h-10 w-20 flex items-center justify-center"
                onClick={() => handleJoinServer()}
              >
                Join
              </button>
            </div>
          </div>
        ) : (
          serverDetail.length === 0 &&
          serverId === null && (
            <div className="flex w-[90%] justify-center p-4 items-center  h-fit bg-black2 rounded-3xl">
              <div className="w-full h-full flex gap-4 items-center justify-center">
                <span className="text-white text-opacity-80">
                  NO SERVER FOUND
                </span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
