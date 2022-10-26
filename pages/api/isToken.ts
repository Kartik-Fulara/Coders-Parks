// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// check weather the user have the token or not in its cookies
import nookies from "nookies";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  if (token) {
    res.status(200).json({ ans: true });
  } else {
    res.status(200).json({ ans: false });
  }
}
