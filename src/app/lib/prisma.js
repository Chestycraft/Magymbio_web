//import primsa 
import { PrismaClient } from "@prisma/client";

//storage for prisma instance
const globalForPrisma = global

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  console.log("Current environment:", process.env.NODE_ENV)

}
console.log("Current environment:", process.env.NODE_ENV)

export default prisma;