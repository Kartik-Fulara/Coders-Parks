import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, input, language } = req.body;
  console.log(code, input, language);
  try {
    const response = await fetch(`${process.env.CODE_RUNNER_URL}/runCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language_id: language,
        input,
      }),
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
