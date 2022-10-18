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

const friends = ({ token }: any) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setusername] = React.useState(false);
  const [sendMsg, setSendMsg] = React.useState(null);
  const [receivedMsg, setReceivedMsg] = React.useState(null);
  const [uid, getUid] = React.useState(null);
  const [sendReq, setSendReq] = React.useState(false);
  const [recieveReq, setRecieveReq] = React.useState(false);

  const socket = useRef<any>();
  React.useEffect(() => {
    socket.current = io("ws://localhost:9739");
    socket.current?.on("getMessage", (data: any) => {
      const { data: ret } = data;
      setReceivedMsg(ret);
    });
    socket.current?.on("getRequest", (data: any) => {
      const { data: ret } = data;
      if (ret) {
        setRecieveReq(true);
      }
    });
  }, []);

  React.useEffect(() => {
    const init = async () => {
      const { data } = await userDetails(token);
      if (
        data &&
        (data.data.username.length > 20 || data.data.username === "")
      ) {
        setusername(true);
      } else {
        setusername(false);
        socket?.current.emit("login", data.data?.id);
        socket?.current.on("activeUsers", (users: any) => {
          console.log("active users", users);
        });
      }
    };

    if (token) {
      init();
    }
  }, []);

  const handleLoading = () => {
    setIsLoading(true);
  };

  const handleNotLoading = () => {
    setIsLoading(false);
  };

  React.useEffect(() => {
    handleNotLoading();
  }, [isLoading]);

  // Sending message through the socket server
  React.useEffect(() => {
    if (sendMsg !== null) {
      socket.current?.emit("sendMessage", sendMsg);
    }
  }, [sendMsg]);

  React.useEffect(() => {
    if (sendReq !== false) {
      socket.current?.emit("sendRequest", sendReq);
    }
  }, [sendReq]);

  return (
    <Index>
      {username ? (
        <SetUserName />
      ) : (
        <>
          <FriendsHolder
            data={token}
            handleLoading={handleLoading}
            recieveMsg={receivedMsg}
            getUid={getUid}
            setSendReq={setSendReq}
          />
          {router.asPath === "/app/friends" && (
            <FriendsDetails
              token={token}
              recieveReq={recieveReq}
              setRecieveReq={setRecieveReq}
              setSendRe={setSendReq}
            />
          )}
          {router.asPath === `/app/friends?id=${router.query.id}` &&
            !isLoading && (
              <DmsComponent
                token={token}
                uid={uid}
                setSendMsg={setSendMsg}
                recieveMsg={receivedMsg}
              />
            )}
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
