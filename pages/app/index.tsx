import React from "react";
import nookies from "nookies";
const index = ({ children }: any) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-black4">
      {children}
    </div>
  );
};

export default index;

export const getServerSideProps = async (ctx: any) => {
  const cookies = nookies.get(ctx);


  if (cookies.token) {
    return {
      redirect: {
        destination: "/app/friends",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: "/?login",
      permanent: false,
    },
  };
};
