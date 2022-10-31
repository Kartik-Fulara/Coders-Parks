import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  const { serverName, serverId, serverImage, userAvatar, userName } = req.body;
  try {
    const response: any = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/server/joinServer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serverName,
          serverId,
          serverImage,
          userAvatar,
          userName,
        }),
      }
    ).then((res) => res.json());
    console.log(response);
    res.status(200).json(response);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
