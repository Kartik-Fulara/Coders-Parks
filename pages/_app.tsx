import '../styles/globals.css'
import React from "react";
import type { AppProps } from "next/app";

import MainLayout from "../layouts/MainLayout";

import { ServerIdContext } from "../Context/ServerIdContext";

function MyApp({ Component, pageProps }: AppProps) {
  const [serverId, setServerId] = React.useState<any>("");

  return (
    <ServerIdContext.Provider value={{ serverId, setServerId }}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ServerIdContext.Provider>
  );
}

export default MyApp
