// get user Details

import { NextApiRequest, NextApiResponse } from "next";
import nookie from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let token = req.query.token;
  if (token === "") {
    // take token from cookies
    token = nookie.get({ req }).token;
  }
  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/chat/getUserInfo`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());

    res.send({ data: data });
  } catch (err) {
    console.log(err);
  }
};
