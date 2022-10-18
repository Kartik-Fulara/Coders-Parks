import React, { useEffect } from "react";

import { getServerDetailsById } from "../../../libs/server";

const ChatComponents = ({ serverId }: any) => {
  const [serverName, setServerName] = React.useState<any>(null);
  const [serverChat, setServerChat] = React.useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const serverDetails = await getServerDetailsById(serverId);
      console.log(serverDetails);
    };

    init();
  }, [serverId]);

  return <div>ChatComponents</div>;
};

export default ChatComponents;
