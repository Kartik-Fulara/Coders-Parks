// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// check weather the user have the token or not in its cookies
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  if (token) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/verifyToken`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const isToken = await response.json();
    console.log(isToken);
    res.status(200).json({ ans: true });
  } else {
    res.status(200).json({ ans: false });
  }
};
