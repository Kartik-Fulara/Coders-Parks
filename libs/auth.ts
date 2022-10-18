import axios from "axios";

export const login = async (email: string, password: string) => {
  const res = await axios.post(`/api/auth/login`, {
    email,
    password,
  });
  return res.data;
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  const res = await axios.post(`/api/auth/register`, {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });
  return res.data;
};

export const logout = async () => {
  const res = await axios.delete(`/api/auth/logout`);
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
