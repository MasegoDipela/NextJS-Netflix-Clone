import { PrismaClient } from "@prisma/client";

//Save your Prisma Client in a global file so that it is not affected by hot reloading.
const client = global.prismadb || new PrismaClient();
if (process.env.NODE_ENV == 'production') global.prismadb = client;

export default client;