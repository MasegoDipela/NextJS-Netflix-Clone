//Input NextAuth in order to add functionality to out authentication page
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import { compare } from 'bcrypt';

import prismadb from '@/lib/prismadb';

export default NextAuth({
    providers: [
        Credentials({
            id: 'Credentials',
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
        signIn: '/auth',
    },
    debug: process.env.NODE_env == 'development',  
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,   
    },
    secret: process.env.NEXTAUTH_SECRET,
});