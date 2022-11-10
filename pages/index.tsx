import type { NextPage } from 'next'
import Head from 'next/head'
import nookies from "nookies";

const Home: NextPage = () => {
  
  return (
    <main className="flex min-h-screen min-w-screen bg-black flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </main>
  );
};

export default Home;

export async function getServerSideProps(ctx: any) {
  // Parse
  const cookies = nookies.get(ctx);

  if (!cookies.token) {
    return {
      props:{}
    };
  }

  return {
    redirect: {
      destination: "/app/friends",
      permanent: false,
    },
  };
}
