import { AuthOptions, Awaitable, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { postAuthLocal } from "@/types/generated/users-permissions-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const u = await postAuthLocal({
            identifier: credentials?.email,
            password: credentials?.password,
          });
          console.log(u);
          const { jwt: apiToken, user } = u;

          if (user) {
            return { ...user, apiToken } as unknown as Awaitable<User>;
          }

          return null;
        } catch (error) {
          console.error(error);
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      const sanitizedToken = Object.keys(token).reduce((p, c) => {
        // strip unnecessary properties
        if (c !== "iat" && c !== "exp" && c !== "jti" && c !== "apiToken") {
          return { ...p, [c]: token[c] };
        } else {
          return p;
        }
      }, {});
      return { ...session, user: sanitizedToken, apiToken: token.apiToken };
    },
    async jwt({ token, user }) {
      if (typeof user !== "undefined") {
        // user has just signed in so the user object is populated
        return user as unknown as JWT;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
};
