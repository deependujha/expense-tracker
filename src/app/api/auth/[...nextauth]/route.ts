import NextAuth, { NextAuthOptions } from "next-auth";
import { AuthOptions } from "../../authoptions";


const handler = NextAuth( AuthOptions );

export { handler as GET, handler as POST };
