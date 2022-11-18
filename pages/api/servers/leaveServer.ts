import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  const { userId, serverID } = req.body;
  try {
    console.log(userId, serverID);
    const response: any = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/change/leaveServer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serverId: serverID,
          userId,
        }),
      }
    ).then((res) => res.json());

    res.status(200).json(response);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
