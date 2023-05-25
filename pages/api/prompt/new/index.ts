import { connectToDatabase } from "@utils/database";
import { NextApiRequest, NextApiResponse } from "next";
import Prompt from "@models/prompt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(400).send("Bad Request");
  const { userId, prompt, tags } = JSON.parse(req.body);
  console.log(userId, prompt, tags)
  try {
    await connectToDatabase();
    const newPrompt = new Prompt({
      creator: userId,
      tags,
      prompt,
    });
    await newPrompt.save();
    return res.status(200).json({ message: "Prompt created successfully", prompt: newPrompt});
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
