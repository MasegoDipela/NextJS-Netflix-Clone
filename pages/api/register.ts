import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';
import { request } from 'http';

//write a function to ensure that we only allow POST calls to this /api/register route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method != 'POST') {
        return res.status(405).end();
    }

    try{
        const { email, name, password } = req.body;

        // Check if an email has already been taken
        const existingUser = await prismadb.user.findUnique({
            where: {
                email: email,
            }
        });
        if (existingUser) {
            return res.status(422).json({ eros: 'Email not available'});
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Save the user's hashed password int a new user model
        const user = await prismadb.user.create({
            data:{
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        });
        
        return res.status(200).json(user);
    }   catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}