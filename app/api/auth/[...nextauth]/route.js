import clientPromise from '@/lib/mongodb';
import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        CredentialsProvider({
            id: "otp-login",
            name: "OTP",
            credentials: {
                email: { label: "Email", type: "text" },
                otp: { label: "OTP", type: "text" }
            },
            // ./api/auth/[...nextauth]/route.js
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db('Shorten');

                // 1. Verify OTP
                const user = await db.collection("urls").findOne({
                    email: credentials.email,
                    verificationCode: credentials.otp
                });

                // Check if user exists and OTP is not expired
                if (!user || new Date() > new Date(user.expiresAt)) {
                    return null; // Returning null triggers the 'error' on frontend
                }

                // 2. Clean up ONLY the code, don't delete the user document
                await db.collection("urls").updateOne(
                    { _id: user._id },
                    { $unset: { verificationCode: "", expiresAt: "" } }
                );

                // 3. Return user object (Must include 'id' as a string)
                return {
                    email: user.email,
                    username: user.username || user.email.split('@')[0],
                    image: user.image || 'https://res.cloudinary.com/dqobmtluz/image/upload/profile_pics_1771154549911?_a=BAMAAALT0',
                };
            }
        })
    ],
    session: {
        strategy: "jwt", // Mandatory when using CredentialsProvider
    },

    callbacks: {
        async jwt({ token, user }) {
            // 'user' is only available the moment of login (from authorize)
            if (user) {
                token.name = user.username;
                token.email = user.email
                token.picture = user.image; // Use 'picture' for the token's image
                token.username = user.username; // <--- Custom Field 1
            }
            return token;
        },
        async session({ session, token }) {
            // 'token' is available on every request/refresh
            if (token) {
                session.user = {
                    ...session.user,
                    username: token.username, // <--- Set it her,
                }
            }
            session.user.name = token.username;
            return session;
        },
    },
})

export { handler as GET, handler as POST }
