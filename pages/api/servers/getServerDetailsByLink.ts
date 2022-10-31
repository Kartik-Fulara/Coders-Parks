import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  const { link } = req.query;
  try {
    const { data }: any = await axios.get(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/server/getServerDetailsByLink?link=${link}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    res.send(data.data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
