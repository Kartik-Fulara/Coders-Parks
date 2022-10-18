import React, { useState } from "react";
import { useRouter } from "next/router";
import Codersgateway from "../components/AuthPages/Coders-gate-way";
import NavBar from "../components/NavBar/NavBar";
import toast, { Toaster } from "react-hot-toast";
import CreateNewServer from "../models/CreateNewServer";
import SideBar from "../components/Sidebar/SideBar";
import { logout } from "../libs/auth";
import { userDetails } from "../libs/chats";
import { getUsersServer } from "../libs/server";

const MainLayout = ({ children }: any) => {
  const [login, setLogin] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = () => {
    setLogin(true);
  };

  const handleRegister = () => {
    setLogin(false);
  };

  const { query } = router;

  React.useEffect(() => {
    if (query?.login === "") {
      handleLogin();
      handleOpen();
    }
    if (query?.register === "") {
      handleRegister();
      handleOpen();
    }
  }, [query]);

  const handleRoutes = ["/app/friends", "/app/channel/c", "/app/profile"];

  const [usersData, setUserData] = useState<any>();
  const [openModel, setOpenModel] = React.useState(false);
  const [serversData, setServersData] = React.useState<any>([]);
  const [call, setCall] = React.useState(false);
  const [id, setId] = React.useState("");

  const getServerData = async () => {
    const { data }: any = await getUsersServer();
    if (data) {
      setServersData(data);
      setCall(false);
    }
  };

  const getUserData = async () => {
    const { data }: any = await userDetails();
    if (data.status === "Ok") {
      setUserData(data.data);
      console.log(data);
    } else {
      setUserData([]);
      toast.error("Something went wrong");
      await logout();
    }
  };

  const handleLogOut = () => {
    const init = async () => {
      const data = await logout();
      if (data.message) {
        setUserData([]);
        toast.success(data.message);
        router.push("/?login");
      }
    };
    init();
  };

  React.useEffect(() => {
    getServerData();
    getUserData();
    router.push("/app/friends");
  }, []);

  const handleModelOpen = () => {
    setOpenModel(true);
  };

  const handleModelClose = () => {
    setOpenModel(false);
  };

  React.useEffect(() => {
    if (call) {
      getServerData();
    }
  }, [call]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <main
        className={` bg-white flex w-screen h-screen ${
          !handleRoutes.includes(router.pathname)
            ? "flex-col gap-4"
            : "flex-row"
        }`}
      >
        {router.pathname === "/" && (
          <NavBar
            handleOpen={handleOpen}
            handleClose={handleClose}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            open={open}
          />
        )}
        {open && !handleRoutes.includes(router.pathname) && (
          <Codersgateway
            login={login}
            handleClose={handleClose}
            handleLogin={handleLogin}
          />
        )}
        {handleRoutes.includes(router.pathname) && (
          <>
            <SideBar
              handleModelOpen={handleModelOpen}
              serversData={serversData}
              usersData={usersData}
              handleLogOut={handleLogOut}
              setId={setId}
            />
            {openModel && (
              <CreateNewServer
                handleModelClose={handleModelClose}
                setCall={setCall}
                id={id}
              />
            )}
          </>
        )}
        {children}
      </main>
    </>
  );
};

export default MainLayout;
