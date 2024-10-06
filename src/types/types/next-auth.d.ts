import NextAuth from "next-auth";
import { courseType, enrollments, userType } from "../types";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    data: userType
  }
}
