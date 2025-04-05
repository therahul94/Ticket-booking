// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate'
// import 'dotenv/config';

// export const prisma = new PrismaClient({
//     datasourceUrl: process.env.DATABASE_URL,
// }).$extends(withAccelerate())

import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

export const prisma = new PrismaClient();