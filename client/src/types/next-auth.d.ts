
import { JWT } from "next-auth/jwt"
import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    username: string;
    organization: string;
    password: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    apiToken: string;
    user: User;
    error: string;
  }
}


declare module "next-auth/jwt" {
    interface JWT {
        exp: number;
        iat: number;
    }
}
