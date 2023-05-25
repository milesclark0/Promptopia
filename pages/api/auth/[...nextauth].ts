import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@utils/database";
import User from "@models/user";
import { log } from "console";
import { connect } from "mongoose";

//for some reason next-auth only works in pages directory, so this will be the only file in pages/

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

const handler: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {},
            async authorize(credentials, req) {
                const { password, username } = credentials as { password: string, username: string };
                console.log({username, password})
                //preform login logic
                await connectToDatabase();
                let foundUser = null;
                //if validate email passes, then we know that the user is logging in with email (username === email)
                foundUser = validateEmail(username) ? await User.findOne({ email: username }) : await User.findOne({ username: username });
                if (!foundUser) {
                    console.log("User not found")
                    return null;
                }
                // check if password is correct
                console.log("here")
                try {
                    await foundUser.comparePassword(password, (err: Error, isMatch: boolean) => {
                        if (err) {
                            console.log(err.message)
                            return null;
                        }
                        if (!isMatch) {
                            console.log("Password does not match")
                            return null;
                        }
                    });
                }
                catch (err) {
                    console.log( "err")
                    return null;
                }
                console.log(foundUser)
                return {
                    id: foundUser._id.toString(),
                    email: foundUser.email,
                    name: foundUser.username,
                    image: foundUser.image,
                };
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
        async signIn({ profile, user }) {
            try {
                await connectToDatabase();
                // if user does not exist, create new user
                const userExists = await User.findOne({ email: profile?.email});
                //TODO: add cases for other providers bc the field names are different
                if (!userExists && !user) {
                    console.log("creating new user")
                    await User.create({
                        email: profile?.email,
                        username: profile?.name?.replace(" ", "").toLowerCase(),
                        // @ts-ignore
                        image: profile?.picture
                    });
                }
                return true;
            } catch (error) {
                return false;
            }
        },
    },
};

export default NextAuth(handler);
