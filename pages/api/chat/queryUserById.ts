import axios from "axios";
import { NextApiRequest, NextApiResponse} from "next";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const cookies = nookies.get({ req });

    const token = cookies.token;


    const { id } = req.query;

    try {
        const data = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/chat/queryUserById?id=${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.data);
        
        res.send({ data: data });
    } catch (err) {
        console.log(err);
    }
}