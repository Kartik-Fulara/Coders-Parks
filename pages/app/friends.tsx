import React, { useRef } from "react";
import nookies from "nookies";
import Index from "./index";
import FriendsHolder from "../../components/Holders/FriendsHolder";
import FriendsDetails from "../../components/Holders/details-chats-holders/FriendsDetails";
import { useRouter } from "next/router";
import DmsComponent from "../../components/Holders/details-chats-holders/DmsComponent";

import SetUserName from "../../models/SetUserName";

import {
  UserDataContext,
  ServerDataContext,
} from "../../Context/ContextProvide";

const friends = () => {
  const router = useRouter();
  const [sendReq, setSendReq] = React.useState<any>(false);
  const [recieveReq, setRecieveReq] = React.useState<any>(false);
  const [username, setUsername] = React.useState<any>(false);
  const { userData } = React.useContext(UserDataContext);

  const [loading, setLoading] = React.useState(true);
  const { serversData, chats } = React.useContext(ServerDataContext);

  React.useEffect(() => {
    const tempUName = userData?.username || "";
    if (tempUName.length > 20) {
      setUsername(true);
    } else {
      setUsername(false);
    }
  }, [userData]);

  return (
    <Index>
      {username ? (
        <SetUserName setUsername={setUsername} />
      ) : (
        <>
          <FriendsHolder />
          {router.asPath === "/app/friends" && (
            <FriendsDetails
              recieveReq={recieveReq}
              setRecieveReq={setRecieveReq}
              setSendRe={setSendReq}
            />
          )}
          {router.asPath === `/app/friends?id=${router.query.id}` && (
            <DmsComponent />
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
    props: {},
  };
};
