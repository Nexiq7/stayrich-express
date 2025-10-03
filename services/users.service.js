import bcrypt from 'bcrypt';
import prisma from '../prisma/prisma.js';

export default class UsersService {
     createUser = async (email, password) => {

          const hashedPassword = await bcrypt.hash(password, 10);

          const user = await prisma.user.create({
               data: {
                    email: email,
                    hashedPassword: hashedPassword
               },
          })
          return user;
     }

     getUsers = async () => {
          const users = await prisma.user.findMany({
               select: {
                    id: true,
                    email: true,
                    createdAt: true,
               }
          });
          return users;
     }

     getUserById = async (id) => {
          const user = await prisma.user.findUnique({
               where: { id: Number(id) }
          });
          return user;
     }
}