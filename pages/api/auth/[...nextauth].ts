import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@utils/database";
import User from "@models/user";
import { log } from "console";
import { connect } from "mongoose";
import { SessionUser } from "@globals/types";
import { rejects } from "assert";


const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET, GITHUB_ID, GITHUB_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !JWT_SECRET || !GITHUB_ID || !GITHUB_SECRET) {
    const missingEnvVars = [];
    if (!GOOGLE_CLIENT_ID) missingEnvVars.push("GOOGLE_CLIENT_ID");
    if (!GOOGLE_CLIENT_SECRET) missingEnvVars.push("GOOGLE_CLIENT_SECRET");
    if (!JWT_SECRET) missingEnvVars.push("JWT_SECRET");
    if (!GITHUB_ID) missingEnvVars.push("GITHUB_ID");
    if (!GITHUB_SECRET) missingEnvVars.push("GITHUB_SECRET");
    throw new Error("Missing environment variables: " + missingEnvVars.join(", "));

}

const validateEmail = (email: string | undefined) => {
    if (!email) {
        return null;
    }
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const comparePasswordAsync = (foundUser: any, password:string) => {
    return new Promise<SessionUser>((resolve, reject) => {
        foundUser.comparePassword(password, function (err: Error, isMatch: boolean) {
            if (err) {
                reject("Error comparing password")
            }
            if (!isMatch) {
                reject("Incorrect password")
            } else {
                resolve({
                    id: foundUser._id.toString(),
                    email: foundUser.email,
                    username: foundUser.username,
                    image: foundUser.image,
                });
            }
        });
    })
}

const handler: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {},
            async authorize(credentials, req) {
                const { password, username } = credentials as { password: string, username: string };
                console.log({ username, password })
                //preform login logic
                await connectToDatabase();
                let foundUser: any = null;
                //if validate email passes, then we know that the user is logging in with email (username === email)
                foundUser = validateEmail(username) ? await User.findOne({ email: username }) : await User.findOne({ username: username });
                if (!foundUser) {
                    throw new Error("User not found");
                }
                // check if password is correct
                try {
                    const val = await comparePasswordAsync(foundUser, password);
                    return val;
                } catch (error) {
                    if (typeof(error) === "string") {
                        throw new Error(error);
                    }
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
        }),
    ],
    secret: process.env.JWT_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async session({ session }: { session: Session }) {
            if (!session.user) {
                return session;
            }
            const sessionUser = await User.findOne({ email: session?.user?.email });
            session.user.id = sessionUser?._id.toString();
            return session;
        },
        async signIn({ user, profile, }) {
            console.log("user:", user)
            console.log("profile:", profile)
            try {
                await connectToDatabase();
                // if user does not exist, create new user
                const userExists = await User.findOne({ email: user?.email });
                if (!userExists) {
                    await User.create({
                        email: user?.email,
                        username: user?.email,
                        // @ts-ignore
                        image: user?.image,
                    });
                    console.log("New user created")
                } else {
                    console.log("Account Found")
                }
                return true;
            } catch (error) {
                console.log(error)
                return false;
            }
        },
    },
};

export default NextAuth(handler);
