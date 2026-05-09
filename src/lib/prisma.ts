import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use POSTGRES_URL (Vercel) or DATABASE_URL (local)
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('Missing DATABASE_URL or POSTGRES_URL environment variable')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma