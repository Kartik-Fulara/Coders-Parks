import React, { useContext } from "react";
import { CloseEye, OpenEye } from "../../../Icons/Icons";

import { login } from "../../../libs/auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

// get Static for login form

const Login = ({ handleLogin }: any) => {
  // login form state

  const [loginProps, setLoginProps] = React.useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const [show, setShow] = React.useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const data = await login(loginProps.email, loginProps.password);

      if (data.status === "ok") {
        handleLogin(true);
        router.push("/app/friends");
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center gap-4 items-start">
      <div>
        <h1 className="text-2xl">CODERS GATE WAY</h1>
        <p className="text-lg text-center  text-gray-400 flex flex-col">
          A place where you can find the other coders to chat with them
        </p>
      </div>
      <form
        onSubmit={(e: any) => handleSubmit(e)}
        className="flex flex-col items-start justify-center gap-4 w-full"
      >
        {/* Email input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-4 bg-transparent outline-none border-white rounded-lg w-[90%] lg:w-[30rem] shadow-xl border-2"
          onChange={(e: any) =>
            setLoginProps({ ...loginProps, email: e.target.value })
          }
        />
        <div className="flex justify-center items-center gap-2 p-4 bg-transparent outline-none border-white rounded-lg w-[90%] lg:w-[30rem] shadow-xl border-2">
          <input
            type={!show ? "password" : "text"}
            placeholder="Password"
            className="w-full h-full bg-transparent outline-none border-none"
            onChange={(e) =>
              setLoginProps({ ...loginProps, password: e.target.value })
            }
          />
          {show ? (
            <span onClick={() => setShow(!show)} className="h-8 w-8">
              <CloseEye />
            </span>
          ) : (
            <span onClick={() => setShow(!show)} className="h-8 w-8">
              <OpenEye />
            </span>
          )}
        </div>
        <button className="p-4  bg-blue-500  rounded-2xl w-[30rem] shadow-xl">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

// Language: typescript
