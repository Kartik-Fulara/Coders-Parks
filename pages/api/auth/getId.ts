import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/getId`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
