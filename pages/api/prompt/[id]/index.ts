import { connectToDatabase } from "@utils/database";
import { NextApiRequest, NextApiResponse } from "next";
import Prompt from "@models/prompt";


// route: /api/prompt/
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET":
            return await GET(req, res);
        case "PATCH":
            return await PATCH(req, res);
        case "DELETE":
            return await DELETE(req, res);
        default:
            return res.status(400).json({ message: "Bad Request" });
    }
}

async function GET (req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        await connectToDatabase();
        const prompt = await Prompt.findById(id).populate("creator");
        if (!prompt) return res.status(404).json({ message: "Prompt not found" });
        return res.status(200).json({ message: "Prompt fetched successfully", prompt});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function PATCH (req: NextApiRequest, res: NextApiResponse) {
    const {prompt, tags} = JSON.parse(req.body);
    const { id } = req.query;
    try {
        await connectToDatabase();
        const updatedPrompt = await Prompt.findByIdAndUpdate(id, {prompt, tags}, {new: true}).populate("creator");
        if (!updatedPrompt) return res.status(404).json({ message: "Prompt not found" });
        return res.status(200).json({ message: "Prompt updated successfully", prompt: updatedPrompt });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function DELETE (req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    try {
        await connectToDatabase();
        const deletedPrompt = await Prompt.findByIdAndDelete(id);
        if (!deletedPrompt) return res.status(404).json({ message: "Prompt not found" });
        return res.status(200).json({ message: "Prompt deleted successfully", prompt: deletedPrompt });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}