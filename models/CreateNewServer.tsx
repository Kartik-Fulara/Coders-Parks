import React, { useContext } from "react";
import tw from "tailwind-styled-components";
import { CloseCircle, ImageIcon } from "../Icons/Icons";
import Avatar from "react-avatar";
import { createServer } from "../libs/server";
import { UserDataContext } from "../Context/ContextProvide";

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
    h-[30rem]
    bg-black4
    text-white
`;

const CreateNewServer = ({ handleModelClose, setCall, id }: any) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [file, setFile] = React.useState<File>();

  const { userData } = useContext(UserDataContext);

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
    console.log(serverDetail);
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
      console.log(response);
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
            aria-label="close"
            onClick={handleModelClose}
            className="h-10 w-10"
          >
            <CloseCircle />
          </button>
        </div>
        <div className="h-full w-full flex flex-col gap-4">
          <div className="h-[4rem] w-full flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold">Create New Server</h1>
            <p className="text-white opacity-50">
              Give your Server a Name and Image
            </p>
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
        </div>
      </CreateServerModelWrapper>
    </CreateServerModelComponent>
  );
};

export default CreateNewServer;

// Image preview Component

// Language: typescript
