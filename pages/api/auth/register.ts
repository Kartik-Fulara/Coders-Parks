// register with user

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { KeyboardReturnOutlined } from "@material-ui/icons";

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
    res.send({ status: "Something went wrong" });
    return;
  }
};
