import React, { useState, useEffect, useContext } from "react";
import {
  UserDataContext,
  ServerDataContext,
} from "../../Context/ContextProvide";
import Avatar from "react-avatar";
import { Pencil, Setting, CloseEye, OpenEye } from "../../Icons/Icons";
import { changePassword, logout, updateDetails } from "../../libs/auth";
import { changeUserName } from "../../libs/chats";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
const profile = () => {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserDataContext);
  const { serversData, setServersData } = useContext(ServerDataContext);
  const [loading, setLoading] = useState(true);

  const [editProfile, setEditProfile] = useState(true);

  const [name, setName] = useState({
    firstName: "",
    lastName: "",
  });

  const [newDetails, setNewDetails] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [open, setOpen] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
    edit: true,
    update: false,
  });

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
    password: false,
  });

  useEffect(() => {
    console.log(userData);
    if (userData.length !== 0) {
      setLoading(false);

      const fullName = userData.name.split(" ");
      setName({
        firstName: fullName[0],
        lastName: fullName[1],
      });
    } else {
      setLoading(true);
    }
  }, [userData]);

  useEffect(() => {
    if (
      newDetails.firstName !== "" ||
      newDetails.lastName !== "" ||
      newDetails.username !== "" ||
      newDetails.email !== ""
    ) {
      if (newDetails.password !== "" && !open.edit) {
        setOpen({
          ...open,
          update: true,
        });
      } else {
        setOpen({
          ...open,
          update: false,
        });
      }
    } else {
      setOpen({
        ...open,
        update: false,
      });
    }
  }, [newDetails]);

  const LoadingFunction = () => {
    return (
      <div className="flex justify-center items-center h-full w-full relative bg-black4">
        <div className="text-white">Opening Your Profile... </div>
        <div className="animate-spin rounded-full h-48 w-48 border-t-2 border-b-2 border-green-500 absolute"></div>
      </div>
    );
  };

  const handlePasswordUpdate = () => {
    if (
      (passwords.new_password === passwords.confirm_password &&
        passwords.new_password !== "") ||
      passwords.confirm_password !== ""
    ) {
      const init = async () => {
        const response = await changePassword(
          userData?.email,
          passwords.old_password,
          passwords.new_password
        );
        console.log(response);

        if (response.message === "PASSWORD CHANGED SUCCESSFULLY") {
          toast.success(response.message);
          await logout();
        } else if (response.password) {
          toast.error("Old " + response.password);
        } else {
          toast.error("Something Went Wrong");
        }
      };
      if (
        passwords.old_password !== "" &&
        passwords.new_password !== "" &&
        passwords.confirm_password !== ""
      ) {
        init();
      } else {
        toast.error("Please Fill All The Fields");
      }
      console.log(userData);
      console.log("passwords", passwords);
    } else if (
      passwords.new_password === "" ||
      passwords.confirm_password === ""
    ) {
      toast.error("Please Fill All The Fields");
    } else {
      toast.error("New Password and Confirm Password doesn't match");
    }
  };

  const Text = ({ children }: any) => {
    return (
      <div className="w-full h-fit text-lg text-white opacity-70">
        <span>{children}</span>
      </div>
    );
  };

  const handleUpdate = () => {
    if (
      newDetails.password !== "" &&
      (newDetails.email !== "" ||
        newDetails.firstName !== "" ||
        newDetails.lastName !== "")
    ) {
      const init = async () => {
        const response = await updateDetails(newDetails);
        console.log(response);
        if (
          response !== undefined &&
          response.message === "DETAILS UPDATED SUCCESSFULLY"
        ) {
          console.log(userData);
          const { data } = response;
          if (data !== undefined && data.message === "User updated") {
            const { data: retUserData } = data;
            const { _id: id, email, uid, name, username } = retUserData;
            if (email !== undefined && email !== userData.email) {
              const res = await logout();
              if (res.message === "LOGGED OUT SUCCESSFULLY") {
                router.push("/");
                toast.success(
                  "Details Updated Successfully Please Login Again with new credentials"
                );
              }
            } else {
              setUserData({
                id,
                uid,
                name,
                email,
                username,
              });
              let uName = username;
              if (
                serversData.members.filter(
                  (member: any) => member.userId === id
                ).length !== 0
              ) {
                const members = serversData.members.map((member: any) => {
                  if (member.userId === id) {
                    member.userName = uName;
                  }
                  return member;
                });
                setServersData({
                  ...serversData,
                  members,
                });
              }
              toast.success("Details Updated Successfully");
            }
          } else {
            toast.error("Something Went Wrong");
          }
        } else {
          const { data, error } = response;
          if (error !== undefined) {
            const { name, email, password } = error;
            if (name !== undefined && name !== "") {
              toast.error(name);
            }
            if (email !== undefined && email !== "") {
              toast.error(email);
            }
            if (password !== undefined && password !== "") {
              toast.error(password);
            }
          }
        }
      };
      init();
    } else if (newDetails.username !== "" && newDetails.password) {
      const init = async () => {
        const response = await changeUserName(
          newDetails.username,
          newDetails.password
        );
        console.log(response);
        if (response && response !== undefined) {
          const { data } = response;
          if (data !== undefined && data.message === "Username changed") {
            setUserData({
              ...userData,
              username: data.username,
            });
            if (
              serversData.members.filter(
                (member: any) => member.userId === userData.id
              ).length !== 0
            ) {
              const members = serversData.members.map((member: any) => {
                if (member.userId === userData.id) {
                  member.userName = data.username;
                }
                return member;
              });
              setServersData({
                ...serversData,
                members,
              });
            }
            toast.success("Username Updated Successfully");
          } else {
            toast.error(response.message);
          }
        } else {
          toast.error("Something Went Wrong");
        }
      };
      init();
    } else {
      toast.error("Please Fill All The Fields");
    }
  };

  const handleReset = () => {
    setOpen({
      name: false,
      username: false,
      email: false,
      password: false,
      edit: true,
      update: false,
    });

    setNewDetails({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-black text-white justify-center items-center flex-col">
      {loading ? (
        <LoadingFunction />
      ) : (
        <div className="w-full h-full flex flex-col justify-start items-start gap-5">
          <nav className="w-full h-[5rem] bg-black3">
            <div className="flex justify-between items-center h-full px-4 w-full">
              <div className="flex items-center h-full w-fit px-2 text-white text-2xl">
                My Profile
              </div>
              <button
                className="flex items-center h-[2.5rem] rounded-2xl w-fit px-2 text-white bg-red-700 pb-1"
                onClick={() => {
                  alert("Account Deleted");
                }}
              >
                Delete My Account
              </button>
            </div>
          </nav>
          <div className="w-[95%] md:w-full h-full gap-5 flex flex-col justify-start items-center">
            <div className="w-full h-fit flex  gap-4 px-4">
              <div
                className={`h-[3rem] px-4 text-xl cursor-pointer select-none items-center w-fit flex gap-4 rounded-xl ${
                  editProfile ? "bg-black1" : "bg-transparent text-opacity-60"
                }`}
                onClick={() => setEditProfile(true)}
              >
                <div className="h-full w-[2rem]">
                  <Pencil />
                </div>
                <span className="text-xl">Edit Profile</span>
              </div>
              <div
                className={`h-[3rem] px-4 text-xl cursor-pointer items-center select-none w-fit flex gap-4 rounded-xl ${
                  !editProfile ? "bg-black1" : "bg-transparent text-opacity-60"
                }`}
                onClick={() => setEditProfile(false)}
              >
                <div className="h-full w-[2rem]">
                  <Setting />
                </div>
                <span className="text-xl">Change Password</span>
              </div>
            </div>
            {editProfile ? (
              <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
                <div className="w-full justify-center items-center flex">
                  <div className="h-[5rem] w-[5rem] rounded-full pb-1 flex justify-center items-center bg-black">
                    <Avatar
                      name={userData.username}
                      className="w-full h-full"
                      round={true}
                    />
                  </div>
                </div>
                <div className="w-[90%] lg:w-[30rem] justify-center items-center flex flex-col gap-4">
                  <div className="w-full flex justify-center items-center gap-4 h-fit">
                    <div className="flex flex-col gap-4 w-full">
                      <Text>First Name</Text>
                      {open.name ? (
                        <input
                          placeholder={name.firstName}
                          type="text"
                          className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300"
                          onChange={(e) =>
                            setNewDetails({
                              ...newDetails,
                              firstName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 flex justify-start items-center">
                          {name.firstName}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                      <Text>Last Name</Text>
                      {open.name ? (
                        <input
                          placeholder={name.lastName}
                          type="text"
                          className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300"
                          onChange={(e) =>
                            setNewDetails({
                              ...newDetails,
                              lastName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 flex justify-start items-center">
                          {name.lastName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Text>UserName</Text>
                    {open.username ? (
                      <input
                        placeholder={userData.username}
                        type="text"
                        className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300"
                        onChange={(e) =>
                          setNewDetails({
                            ...newDetails,
                            username: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 flex justify-start items-center">
                        {userData.username}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Text>Email</Text>
                    {open.email ? (
                      <input
                        placeholder={userData.email}
                        type="text"
                        className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300"
                        onChange={(e) =>
                          setNewDetails({
                            ...newDetails,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 flex justify-start items-center">
                        {userData.email}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <div className="flex w-full h-fit justify-between items-center">
                      <Text>Password</Text>
                    </div>
                    {open.password ? (
                      <div className="w-full flex h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 justify-center items-center">
                        <input
                          placeholder="Enter Your Current Password"
                          type={showPassword.password ? "text" : "password"}
                          className="bg-transparent h-full w-full text-black outline-none border-none"
                          value={newDetails.password}
                          onChange={(e) =>
                            setNewDetails({
                              ...newDetails,
                              password: e.target.value,
                            })
                          }
                        />
                        <div
                          className="h-7 w-7 flex justify-center items-center text-black cursor-pointer"
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              password: !showPassword.password,
                            })
                          }
                        >
                          {!showPassword.password ? <OpenEye /> : <CloseEye />}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 flex justify-start items-center">
                        Password
                      </div>
                    )}
                  </div>
                  <div className="w-full gap-4">
                    {/* update and cancel */}
                    <div className="flex justify-between h-[3.5rem] items-center w-full">
                      {open.update ? (
                        <button
                          type="submit"
                          className={`text-center h-[85%] w-[14.5rem]  text-white bg-green-500 opacity-100 pb-1`}
                          onClick={() => {
                            handleUpdate();
                          }}
                        >
                          Update
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className={`text-center h-[85%] w-[14.5rem]  text-white bg-green-900 opacity-80  pb-1`}
                        >
                          Update
                        </button>
                      )}
                      {open.edit ? (
                        <button
                          type="reset"
                          className="text-center h-[85%] w-[14.5rem]  text-white bg-black2 pb-1"
                          onClick={() => {
                            setOpen({
                              email: true,
                              name: true,
                              password: true,
                              edit: false,
                              username: true,
                              update: false,
                            });
                          }}
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          type="reset"
                          className="text-center h-[85%] w-[14.5rem]  text-white bg-black2 pb-1"
                          onClick={() => {
                            handleReset();
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col gap-5 justify-start items-center">
                <div className="w-[90%] md:w-[30rem] flex flex-col justify-start items-center gap-4">
                  <div className="flex flex-col gap-4 w-full">
                    <Text>Old Password</Text>
                    <div className="w-full flex h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 justify-center items-center">
                      <input
                        placeholder="Enter Your Current Password"
                        type={showPassword.old_password ? "text" : "password"}
                        className="bg-transparent h-full w-full text-black outline-none border-none"
                        value={passwords.old_password}
                        onChange={(e) => {
                          setPasswords({
                            ...passwords,
                            old_password: e.target.value,
                          });
                        }}
                      />
                      <div
                        className="h-7 w-7 flex justify-center items-center text-black cursor-pointer"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            old_password: !showPassword.old_password,
                          })
                        }
                      >
                        {!showPassword.old_password ? (
                          <OpenEye />
                        ) : (
                          <CloseEye />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Text>New Password</Text>
                    <div className="w-full flex h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 justify-center items-center">
                      <input
                        placeholder="New Password"
                        type={showPassword.new_password ? "text" : "password"}
                        className="bg-transparent h-full w-full text-black outline-none border-none"
                        value={passwords.new_password}
                        onChange={(e) => {
                          setPasswords({
                            ...passwords,
                            new_password: e.target.value,
                          });
                        }}
                      />
                      <div
                        className="h-7 w-7 flex justify-center items-center text-black cursor-pointer"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            new_password: !showPassword.new_password,
                          })
                        }
                      >
                        {!showPassword.new_password ? (
                          <OpenEye />
                        ) : (
                          <CloseEye />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    <Text>Confirm Password</Text>
                    <div className="w-full flex h-[2.5rem] px-4 text-xl rounded-xl text-black bg-gray-300 justify-center items-center">
                      <input
                        placeholder="Confirm Password"
                        type={
                          showPassword.confirm_password ? "text" : "password"
                        }
                        className="bg-transparent h-full w-full text-black outline-none border-none"
                        value={passwords.confirm_password}
                        onChange={(e) => {
                          setPasswords({
                            ...passwords,
                            confirm_password: e.target.value,
                          });
                        }}
                      />
                      <div
                        className="h-7 w-7 flex justify-center items-center text-black cursor-pointer"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            confirm_password: !showPassword.confirm_password,
                          })
                        }
                      >
                        {!showPassword.confirm_password ? (
                          <OpenEye />
                        ) : (
                          <CloseEye />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full gap-4">
                    {/* update and cancel */}
                    <div className="flex justify-between h-[3.5rem] items-center w-full">
                      <button
                        className={`text-center h-[85%] w-[14.5rem]  text-white bg-green-600 pb-1`}
                        onClick={() => {
                          handlePasswordUpdate();
                        }}
                      >
                        Change
                      </button>
                      <button
                        className="text-center h-[85%] w-[14.5rem]  text-white bg-black1 pb-1"
                        onClick={() => {
                          setPasswords({
                            old_password: "",
                            new_password: "",
                            confirm_password: "",
                          });
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default profile;
