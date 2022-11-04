// reset the password of current user

import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // http://localhost:6969/auth/reset-password
try {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: req.body.username,
        oldpassword: req.body.oldpassword,
        newpassword: req.body.password,
      }),
    }
  );
  const resetPass = await response.json();
  res.status(200).json(resetPass);
} catch (err: any) {
  console.log(err);
  res.status(500).send({ message: err.message });
}
};
