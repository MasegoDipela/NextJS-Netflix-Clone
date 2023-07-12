//Input NextAuth in order to add functionality to out authentication page
import NextAuth, { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';


import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prismadb from '@/lib/prismadb';

// Add all the providers that will authenticate users during sign in/login and sign up/register
export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || ''
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                }
            },
            async authorize(credentials) {
                // Check if Email credential was submited 
                if (!credentials?.email){
                    throw new Error('Email required');
                }
                // Check if Password credential was submited 
                if (!credentials?.password){
                    throw new Error('Password required');
                }

                const user = await prismadb.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                });

                // Check if the user exists
                if (!user || !user.hashedPassword) {
                    throw new Error('Email does not exist');
                }

                // Check if the password the user entered is correct

                const isCorrectPassword = await compare(credentials.password, user.hashedPassword);

                if (!isCorrectPassword) {
                    throw new Error('Incorrect password');
                }

                return user;
            }  
        })
    ],
    pages: {
        signIn: '/auth'
    },
    debug: process.env.NODE_env == 'development',
    adapter: PrismaAdapter(prismadb),  
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,   
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);