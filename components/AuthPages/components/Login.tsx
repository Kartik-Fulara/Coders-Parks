import React, { useContext } from "react";
import { CloseEye, OpenEye } from "../../../Icons/Icons";

import { LoadingIcon } from "../../../Icons/Icons";
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
  const [isLogin, setIsLogin] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsLogin(true);
      const data = await login(loginProps.email, loginProps.password);

      if (data.status === "ok") {
        handleLogin(true);
        setIsLogin(false);
        router.push("/app/friends");
        toast.success("Login successful");
      } else if (data.status === "error") {
        const { email, name, password } = data.message;
        if (email !== "" && password !== "") {
          toast.error("Email or password is incorrect");
        } else if (email !== "") {
          toast.error(email);
        } else if (password !== "") {
          toast.error(password);
        } else if (name !== "") {
          toast.error(name);
        }

        setIsLogin(false);
      }
    } catch (error: any) {
      toast.error(error.message);
      setIsLogin(false);
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
          className="p-4 bg-transparent outline-none border-white rounded-lg w-full shadow-xl border-2"
          onChange={(e: any) =>
            setLoginProps({ ...loginProps, email: e.target.value })
          }
        />
        <div className="flex justify-center items-center gap-2 p-4 bg-transparent outline-none border-white rounded-lg w-full shadow-xl border-2">
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
        {isLogin ? (
          <button
            type="button"
            disabled
            className="p-4 bg-blue-700 rounded-2xl w-full shadow-xl justify-center items-center text-center flex gap-4"
          >
            <span className="h-6 w-6">
              <LoadingIcon />
            </span>
            <span className="text-white">Loading...</span>
          </button>
        ) : (
          <button
            type="submit"
            className="p-4 bg-blue-500 rounded-2xl w-full shadow-xl justify-center items-center text-center flex"
          >
            Login
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;

// Language: typescript
