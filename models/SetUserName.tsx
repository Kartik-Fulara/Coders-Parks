import React from "react";
import tw from "tailwind-styled-components";
import { CloseCircle } from "../Icons/Icons";
import { changeUserName, queryUserByUserName } from "../libs/chats";
import { logout } from "../libs/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
const SetUserNameComponent = tw.section`
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

const SetUserNameWrapper = tw.div`
    flex
    flex-col
    items-center
    justify-center
    w-[30rem]
    h-[20rem]
    bg-black4
    text-white
    relative
`;

const SetUserName = ({ setUsername }: any) => {
  const router = useRouter();

  const [userName, setUserName] = React.useState<string>("");

  const handleLogout = async () => {
    const data = await logout();
    if (data.message) {
      router.push("/?login");
      toast.success("Verify yourself to continue");
      setUsername(false);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const init = async () => {
      const { data: changeUsername } = await changeUserName(userName);

      handleLogout();
    };
    init();
    setUserName("");
  };

  return (
    // @ts-ignore
    <SetUserNameComponent>
      <SetUserNameWrapper>
        <div className="flex flex-col w-full h-full bg-transparent relative">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full justify-center items-center h-full"
          >
            <input
              type="text"
              placeholder="Enter UserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-black1 w-[80%] h-10 text-white text-opacity-50 text-lg outline-none p-4"
            />
            <button
              type="submit"
              className="bg-blue-700 w-[80%] h-10 text-center text-white text-lg font-bold rounded-lg mt-4"
            >
              Set UserName
            </button>
          </form>
        </div>
      </SetUserNameWrapper>
    </SetUserNameComponent>
  );
};

export default SetUserName;
