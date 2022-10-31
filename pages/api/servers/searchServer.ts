import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  const { link } = req.query;
  try {
    const data: any = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/server/getServerDetailsByLink?link=${link}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());
    console.log(data.data);
    res.status(200).json(data.data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
