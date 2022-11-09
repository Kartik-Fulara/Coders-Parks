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
    justify-start
    gap-6
    h-[40rem]
    w-[60%]
    lg:w-[40rem]
    rounded-xl
    shadow-xl
`;

const Codersgateway = ({ login, handleLogin }: any) => {
  return (
    // @ts-ignore
    <Container>
      <Wrapper>
        <AuthContainer>
          {login ? (
            <Login handleLogin={handleLogin} />
          ) : (
            <Register handleLogin={handleLogin} />
          )}
        </AuthContainer>
      </Wrapper>
    </Container>
  );
};

export default Codersgateway;
