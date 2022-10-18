import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });

  const token = cookies.token;

  console.log(token)
  const { username } = req.body;

  console.log(username);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/chat/changeUserName`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      }
    );

    const data = await response.json();

    res.send({ data: data });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};