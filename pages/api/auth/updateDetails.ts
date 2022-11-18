// change the details of current user
import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  const body = req.body;
  console.log(body);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/change/updateDetails`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    console.log(err);
    res.status(500).send({ status: "error" });
  }
};
