import axios from "axios";

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post(`/api/auth/login`, {
      email,
      password,
    });
    // console.log(res);
    return res.data;
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`/api/auth/register`, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    return response.data;
  } catch (e) {
    console.log(e);
    return { status: "error", message: e };
  }
};

export const logout = async () => {
  const res = await axios.delete(`/api/auth/logout`);
  // console.log(res.data);
  return res.data;
};

export const getUid = async (refreshToken: any) => {
  const res = await axios.get(`/api/auth/guid`, {
    headers: {
      authorization: refreshToken,
    },
  });

  if (res.statusText === "Not Found") {
    return {
      status: 401,
      data: {
        message: "Unauthorized",
      },
    };
  }

  return res.data;
};

export const changePassword = async (
  email: any,
  oldPass: any,
  newPass: any
) => {
  try {
    const res = await axios.post(`/api/auth/changePass`, {
      email,
      oldPass,
      newPass,
    });
    return res.data;
  } catch (err: any) {
    console.log(err);
    return { status: "error", message: err };
  }
};

export const updateDetails = async (userDetails: any) => {
  try {
    const res = await axios.post(`/api/auth/updateDetails`, userDetails);
    return res.data;
  } catch (err: any) {
    console.log(err);
    return { status: "error", message: "Something Went Wrong!!" };
  }
};
