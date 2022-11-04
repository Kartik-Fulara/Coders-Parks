// logout the current user
import nookies from "nookies";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // check wheather the cookie is present in the storage or not
  const cookies = nookies.get({ req });

  if (!cookies.token) {
    res.status(200).json({ message: "No token found Logout the user" });
    return;
  }
  try {
    await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/logout`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: cookies.token,
      }),
    });
    // set the current cookie to empty with age 0
    nookies.set({ res }, "token", "", {
      maxAge: 0,
      path: "/",
    });
    res.status(200).json({ message: "Logout the user" });
  } catch (err: any) {
    res.send({ status: "error" });
  }
};
