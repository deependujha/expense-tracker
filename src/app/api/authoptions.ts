import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/prisma/connection";
import { NextAuthOptions } from "next-auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const AuthOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        GoogleProvider( {
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        } ),
    ],

    callbacks: {
        async signIn( { account, profile } ) {
            if ( !profile?.email || !account?.providerAccountId ) {
                throw new Error( "Invalid Google profile" );
            }

            // Idempotent: safe to run every login
            const result = await prisma.user.upsert( {
                where: {
                    email: profile.email,
                },
                update: {
                    name: profile.name,
                    image: ( profile as any ).picture,
                },
                create: {
                    email: profile.email,
                    name: profile.name,
                    image: ( profile as any ).picture,
                    provider: account.provider,          // "google"
                    providerId: account.providerAccountId // Google sub
                },
            } );

            return true;
        },

        async jwt( { token, profile } ) {
            // Persist email on token
            if ( profile?.email ) {
                token.email = profile.email;
            }
            return token;
        },

        async session( { session, token } ) {
            if ( token.email && session.user ) {
                session.user.email = token.email as string;
            }
            return session;
        },
    },
};
