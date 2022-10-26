import '../styles/globals.css'
import React from "react";
import type { AppProps } from "next/app";

import MainLayout from "../layouts/MainLayout";
import ContextProvider from "../Context/ContextProvide";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ContextProvider>
  );
}

export default MyApp
