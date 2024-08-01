import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { getUserByUsername } from "@/lib/prisma/users";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";

async function auth(req, res) {
    // Do whatever you want here, before the request is passed down to `NextAuth`
    const providers = [
        CredentialsProvider.default({
            id: "credentialsAuth",
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log("testAuthorize");
                try {
                    const { password, username } = credentials;
                    // check user existence
                    const { user, error } = await getUserByUsername(username);
                    console.log(user)
                    if (error) {
                        throw new Error("Request cannot be processed");
                    }
                    if (!user) {
                        throw new Error("No user found with this username. Please sign up!");
                    }
                    const checkPassword = await bcrypt.compare(password, user.password);
                    if (!checkPassword || user.username !== username) {
                        throw new Error("Username or password doesn't match");
                    }
                    return user;
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        }),
    ];

    return await NextAuth.default(req, res, {
        adapter: PrismaAdapter(prisma),
        providers: providers,
        session: {
            strategy: "jwt",
            maxAge: 60 * 30,
        },
        pages: {
            signIn: '/login',
        }
    });
}

export { auth as GET, auth as POST };
