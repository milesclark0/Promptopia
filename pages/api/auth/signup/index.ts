import UserModel from "@models/user";
import { connectToDatabase } from "@utils/database";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose, { models } from 'mongoose';

// route: /api/auth/signup
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(400).json({ message: "Bad Request" });
    const fields = JSON.parse(req.body);
    console.log(fields)
    try {
        await connectToDatabase();
        //if the user already exists, return bad request
        const foundUser = await UserModel.findOne({ username: fields.username })
        if (foundUser) {
            console.log("Error creating new user: Username is taken");
            return res.status(400).json({ message: "Username is taken", error: { username: "Username is taken" } })
        }

        const newUser = new UserModel({
            ...fields,
        });
        await newUser.save();
        return res.status(200).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            //format errors into one object
            const errors = Object.assign({}, ...getValidationErrors(error));
            return res.status(400).json({ message: "Bad Request", error: errors });
        }
        return res.status(500).json({ message: "Internal Server Error", error: {other: "Internal Server Error"} });
}
}

function getValidationErrors(error: mongoose.Error.ValidationError) {
    return Object.keys(error.errors).map((err: any) => { return { [err]: error.errors[err].message } });
}