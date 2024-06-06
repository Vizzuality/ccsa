import "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    username: string;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    apiToken: string;
    user: User;
  }
}
