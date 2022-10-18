import React from "react";
import tw from "tailwind-styled-components";
import { CloseCircle, SendMessage, AddFriends } from "../Icons/Icons";
import Avatar from "react-avatar";
import { startChat } from "../libs/chats";
import { queryUserByUserName, addFriends } from "../libs/chats";
import toast from "react-hot-toast";

const SearchUserComponent = tw.section`
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

const SearchUserWrapper = tw.div`
    flex
    flex-col
    items-center
    justify-center
    w-[30rem]
    h-[30rem]
    bg-black4
    text-white
`;

const SearchUser = ({ handleModelClose, handleCall, setSendReq }: any) => {
  const [userName, setUserName] = React.useState<string>("");

  const [user, setUser] = React.useState<any>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const init = async () => {
      const { data } = await queryUserByUserName(userName);
      console.log(data?.data.data);
      if (data?.data.data !== undefined) {
        setUser({ ...data?.data.data });
      } else {
        setUser(" ");
      }
    };
    init();
    setUserName("");
  };

  const handleStartChat = () => {
    const init = async () => {
      const { data } = await startChat(user.id);
      console.log(data);
      handleCall();
      handleModelClose();
    };
    init();
  };

  const handleAddFriends = (id: any) => {
    const init = async () => {
      const { data } = await addFriends(id);
      console.log(data);
      setSendReq(true)
      toast.success("Friend Request Sent");
    };
    init();
  };

  return (
    // @ts-ignore
    <SearchUserComponent>
      <SearchUserWrapper>
        <div
          className="h-16 w-full flex px-6 mb-4 justify-end items-end"
          onClick={handleModelClose}
        >
          <span className="h-10 w-10">
            <CloseCircle />
          </span>
        </div>
        <div className="flex flex-col w-full h-full justify-start items-center gap-6 ">
          <form
            onSubmit={handleSubmit}
            className="flex w-full justify-center gap-4  items-center"
          >
            <input
              type="text"
              placeholder="Search User"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-10 w-[20rem] bg-black1 rounded-lg text-white text-lg font-medium px-4"
            />
            <button type="submit">Search</button>
          </form>
          {user !== " " && user ? (
            <div className="flex w-[90%] justify-between p-4 items-center  h-fit bg-black2 rounded-3xl">
              <div className="w-full h-full flex gap-4 items-center justify-start">
                <Avatar
                  name={user?.username}
                  size="50"
                  round={true}
                  src={user?.profilePicture}
                />
                <span className="text-white text-opacity-80">
                  {user?.username}
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-700 text-white font-bold p-2 rounded-3xl h-10 w-10 "
                  onClick={handleStartChat}
                >
                  <SendMessage />
                </button>
                <button
                  onClick={() => handleAddFriends(user?.id)}
                  className="bg-blue-700 text-white font-bold p-2 rounded-3xl h-10 w-10"
                >
                  <AddFriends />
                </button>
              </div>
            </div>
          ) : (
            user !== null && (
              <div className="flex w-[90%] justify-center p-4 items-center  h-fit bg-black2 rounded-3xl">
                <div className="w-full h-full flex gap-4 items-center justify-center">
                  <span className="text-white text-opacity-80">NOT FOUND</span>
                </div>
              </div>
            )
          )}
        </div>
      </SearchUserWrapper>
    </SearchUserComponent>
  );
};

export default SearchUser;

// Image preview Component

// Language: typescript
