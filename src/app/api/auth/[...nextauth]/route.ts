import NextAuth, { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../../prisma/prisma";
import { compareSync } from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(
          "======================================================================="
        );
        // if (typeof credentials !== "undefined") {
        console.log(credentials);
        const user = await prisma.user.findFirst({
          where: {
            email: credentials!.email,
          },
        });
        console.log(user);
        if (!user) return null;
        if (compareSync(credentials!.password, user?.password!))
          return { id: user.id, name: user.name, email: credentials!.email };
        else return null;
        // } else {
        //   return null;
        // }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ user, session, token }) {
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
      const userData = await prisma.user.findFirst({
        where: { email: session.user!.email! },
        include: {
          createdCourses: true,
          enrollments: {
            include: {
              course: {
                include: {
                  author: {
                    select: {
                      name: true,
                      email: true,
                      education: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!userData) {
        return { ...user, ...session, ...token, userIsExit: false };
      }
      return {
        ...user,
        ...session,
        ...token,
        data: userData,
      };
    },
    async signIn({ email, credentials, user, account, profile }) {
      console.log("-------------------------------------------------------");
      let userExits = await prisma.user.findFirst({
        where: { email: profile?.email },
      });
      if (userExits) return true;
      else {
        let createUser = await prisma.user.create({
          data: {
            email: profile?.email!,
            name: profile?.name ?? "Harry",
            provider: true,
            role: "USER",
          },
        });
        if (createUser) return true;
        else return false;
      }
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
  secret: "tanmay",
  pages: {
    signIn: "/dashboard",
    signOut: "/",
    error: "/error",
  },
  adapter: PrismaAdapter(prisma),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
