import React, { useEffect } from "react";
import { queryUserById } from "../../../libs/chats";
import toast from "react-hot-toast";
import Avatar from "react-avatar";

const DMS_NAME_HOLDER = ({ id }: any) => {
  const [userInfo, setUserInfo] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const { data } = await queryUserById(id);
      setUserInfo(data.data.data);
    };
    if (id !== undefined) {
      
      init();
      console.log(userInfo);
    }
  }, [id]);

  React.useEffect(()=>{
    console.log(userInfo)
  },[userInfo])
  

  return (
    <div className="flex gap-4 h-full w-full justify-start  items-center">
      <Avatar
        name={`${userInfo?.username}`}
        src={`${userInfo?.profileImg}`}
        round={true}
        textSizeRatio={3}
        className="h-[2.5rem] w-[2.5rem]"
      />
      <div className="flex">
        <span className="flex text-white text-opacity-100 text-xl">
          {userInfo?.username}
        </span>
      </div>
    </div>
  );
};

export default DMS_NAME_HOLDER;
