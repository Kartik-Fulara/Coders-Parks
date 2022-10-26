import React, { useState, useEffect } from "react";
import tw from "tailwind-styled-components";
import Login from "./components/Login";
import Register from "./components/Register";

const Container = tw.main`
    flex
    flex-col
    items-start
    justify-start
    h-screen
    w-full
    relative
    
    bg-black
    text-white
`;

const Wrapper = tw.section`
    flex
    flex-col
    lg:flex-row
    items-center
    p-6
    justify-evenly
    h-screen
    w-full
    rounded-xl
    shadow-xl
`;

const AuthContainer = tw.div`

    flex
    flex-col
    items-center
    justify-center
    gap-6
    h-[40rem]
    w-[40rem]
    rounded-xl
    shadow-xl
    p-4

`;

const Codersgateway = ({ login }: any) => {
  return (
    // @ts-ignore
    <Container>
      <Wrapper>
        <AuthContainer>{login ? <Login /> : <Register />}</AuthContainer>
      </Wrapper>
    </Container>
  );
};

export default Codersgateway;
