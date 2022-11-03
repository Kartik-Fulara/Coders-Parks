import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import axios from "axios";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  try {
    const { data }: any = await axios.get(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/server/getallServers`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );


    res.send(data.data.servers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
