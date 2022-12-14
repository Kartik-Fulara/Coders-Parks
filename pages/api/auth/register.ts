// register with user

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { firstName, lastName, password, email } = req.body;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/register`,
      {
        firstName,
        lastName,
        email,
        password,
      }
    );

    const data = await response.data;

    if (response.statusText === "OK" || response.statusText === "Created") {
      res.send({ status: "ok", data: data });
      return;
    } else {
      res.send({ status: "error" });
      return;
    }
  } catch (err: any) {
    const error = err.response.data;
    res.send({ status: "Something went wrong", error: error });
    return;
  }
};
