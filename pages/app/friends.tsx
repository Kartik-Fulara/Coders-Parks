import React, { useRef } from "react";
import nookies from "nookies";
import Index from "./index";
import FriendsHolder from "../../components/Holders/FriendsHolder";
import FriendsDetails from "../../components/Holders/details-chats-holders/FriendsDetails";
import { useRouter } from "next/router";
import DmsComponent from "../../components/Holders/details-chats-holders/DmsComponent";
import { userDetails } from "../../libs/chats";
import SetUserName from "../../models/SetUserName";
import { io } from "socket.io-client";
import { UserDataContext } from "../../Context/ContextProvide";

const friends = ({ token }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setusername] = React.useState(false);
  const [sendMsg, setSendMsg] = React.useState(null);
  const [receivedMsg, setReceivedMsg] = React.useState(null);
  const [sendReq, setSendReq] = React.useState(false);
  const [recieveReq, setRecieveReq] = React.useState(false);

  return (
    <Index>
      {username ? (
        <SetUserName />
      ) : (
        <>
          <FriendsHolder setSendReq={setSendReq} />
          {router.asPath === "/app/friends" && (
            <FriendsDetails
              recieveReq={recieveReq}
              setRecieveReq={setRecieveReq}
              setSendRe={setSendReq}
            />
          )}
          {router.asPath === `/app/friends?id=${router.query.id}` &&
            !isLoading && <DmsComponent />}
        </>
      )}
    </Index>
  );
};

export default friends;

export const getServerSideProps = async (ctx: any) => {
  const cookies = nookies.get(ctx);
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/?login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      token: token || null,
    },
  };
};
