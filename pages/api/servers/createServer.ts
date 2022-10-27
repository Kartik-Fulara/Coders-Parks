import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  const { id, username, userProfileImage, serverName, serverImage } = req.body;
  try {
    const data: any = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/server/createServer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          username,
          userProfileImage,
          serverName,
          serverImage,
        }),
      }
    );
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
