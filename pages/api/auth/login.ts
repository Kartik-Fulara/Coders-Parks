import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    // save to httpOnly cookies to prevent XSS attacks and CSRF attacks (CSRF attacks are not possible because we are using the same domain) and prevent access from the client side (document.cookie)
    res.setHeader(
      "Set-Cookie",
      `token=${data.token}; path=/; expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
      ).toUTCString()}; HttpOnly`
    ); // 7 days

    if (response.ok) {
      res.send({ status: "ok" });
    } else {
      res.send({ status: "error", message: data.message });
    }
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
