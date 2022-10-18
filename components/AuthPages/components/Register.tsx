import React from "react";
import { CloseEye, OpenEye } from "../../../Icons/Icons";

import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { register } from "../../../libs/auth";

const Register = () => {
  const [userDetails, setUserDetails] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [show, setShow] = React.useState(false);

  const [samePassword, setSamePassword] = React.useState(true);

  const router = useRouter();

  const checkPassword = () => {
    if (userDetails.password === userDetails.confirmPassword) {
      setSamePassword(true);
      return true;
    } else {
      setSamePassword(false);
      return false;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (checkPassword()) {
      try {
        const data = await register(
          userDetails.firstName,
          userDetails.lastName,
          userDetails.email,
          userDetails.password
        );

        if (data.status === "ok") {
          router.push("/?login");
        } else if (data.status === "error") {
          toast.error(data.status);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
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
        <div className="flex w-[79%] gap-2 h-fit">
          <input
            type="text"
            placeholder="First Name"
            className="p-4 bg-transparent outline-none border-white  w-[50%] lg:w-[30rem] shadow-xl border-2 rounded-l-xl"
            onChange={(e) =>
              setUserDetails({ ...userDetails, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="p-4 bg-transparent outline-none border-white  w-[50%] lg:w-[30rem] shadow-xl border-2 rounded-r-xl"
            onChange={(e) =>
              setUserDetails({ ...userDetails, lastName: e.target.value })
            }
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          className="p-4 bg-transparent outline-none border-white rounded-lg w-[90%] lg:w-[30rem] shadow-xl border-2"
          onChange={(e) =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
        />
        <div
          className={`flex justify-center items-center gap-2 p-4 bg-transparent outline-none ${
            samePassword ? "border-white" : "border-red-800"
          } rounded-lg w-[90%] lg:w-[30rem] shadow-xl border-2`}
        >
          <input
            type={!show ? "password" : "text"}
            placeholder="Password"
            className="w-full h-full bg-transparent outline-none border-none"
            onChange={(e) =>
              setUserDetails({ ...userDetails, password: e.target.value })
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
        <div
          className={`flex justify-center items-center gap-2 p-4 bg-transparent outline-none ${
            samePassword ? "border-white" : "border-red-800"
          } rounded-lg w-[90%] lg:w-[30rem] shadow-xl border-2`}
        >
          <input
            type={!show ? "password" : "text"}
            placeholder="Confirm Password"
            className="w-full h-full bg-transparent outline-none border-none"
            onChange={(e) =>
              setUserDetails({
                ...userDetails,
                confirmPassword: e.target.value,
              })
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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
