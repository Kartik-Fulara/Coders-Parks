import React from "react";
import tw from "tailwind-styled-components";
import Image from "next/image";
import { CloseIcon } from "../../Icons/Icons";

import { useRouter } from "next/router";

const Navbar = tw.nav`

absolute
top-0
flex
w-full
overflow-hidden
h-[8rem]
bg-transparent
z-50
justify-center 
items-center

`;

const NavBar = ({
  handleOpen,
  handleClose,
  handleLogin,
  handleRegister,
  open,
}: any) => {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push("?login");
    handleLogin(true);
    handleOpen();
  };

  const handleRegisterClick = () => {
    router.push("?register");

    handleRegister();
    handleOpen();
  };

  const ImageHolder = tw.div`
    cursor-pointer
    relative
    h-[6rem]
    w-[20rem]
    rounded-lg
    overflow-hidden
    
`;

  return (
    //@ts-ignore
    <Navbar>
      <section className="w-full justify-between items-center h-full flex px-5 gap-10">
        <div className="flex items-center justify-center gap-4">
          {/* @ts-ignore */}
          <ImageHolder
            onClick={() => {
              router.push("/");
              handleClose();
            }}
          >
            <Image src="/Asserts/Coders.png" alt="Ghost Gate Way" fill={true} />
          </ImageHolder>
          <span
            className="text-white font-bold text-2xl cursor-pointer"
            onClick={handleLoginClick}
          >
            Login
          </span>
          <span
            className="text-white text-center font-bold bg-green-500 h-15 w-44 px-2 pt-1 pb-2   text-2xl cursor-pointer"
            onClick={handleRegisterClick}
          >
            Register
          </span>
        </div>
        {open && (
          <div
            className="flex justify-center items-center h-8 w-8 text-white cursor-pointer"
            onClick={handleClose}
          >
            <CloseIcon />
          </div>
        )}
      </section>
    </Navbar>
  );
};

export default NavBar;
