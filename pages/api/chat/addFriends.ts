import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;

  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/chat/add-friends?friendId=${req.query.friendId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    res.send({ data: data });
  } catch (err) {
    console.log(err);
    res.send({ status: "error" });
  }
};
