import { connectToDatabase } from "@utils/database";
import { NextApiRequest, NextApiResponse } from "next";
import Prompt from "@models/prompt";


// route: /api/users/[id]/posts/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(400).json({ message: "Bad Request" });
    const { id } = req.query;
    try {
        await connectToDatabase();
        const prompts = await Prompt.find({creator: id}).populate("creator");
        return res.status(200).json({ message: "Prompts fetched successfully", prompts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}