import prisma from '../prisma/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthService {

    authenticateUser = async (email, password) => {

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        const verifiedUser = await bcrypt.compare(password, user.hashedPassword);
        if (!verifiedUser) {
            return null;
        }

        const payload = { id: user.id, email: user.email };

        const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: "30d"
        });

        return accessToken;
    }
    validateUser = async (email) => {

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })

        if (user) {
            return true;
        } else {
            return false;
        }
    }
}