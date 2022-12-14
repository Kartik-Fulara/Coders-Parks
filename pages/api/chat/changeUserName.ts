import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });

  const token = cookies.token;

  const { username,pass } = req.body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/chat/changeUserName`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username,pass }),
      }
    );

    const data = await response.json();

    res.send({ data: data });
  } catch (err:any) {
    console.log(err);
    if (err.response.data.message) {
      res.status(401).send({ message: err.response.data.message });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};
