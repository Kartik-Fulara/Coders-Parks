// forgot to the current user

import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // http://localhost:6969/auth/forgot-password
try {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: req.body.email,
        username: req.body.username,
        newpassword: req.body.password,
      }),
    }
  );
  const forgotPass = await response.json();
  res.status(200).json(forgotPass);
} catch (err: any) {
  console.log(err);
  res.status(500).send({ message: "Error" });
}
};
