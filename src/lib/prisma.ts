import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export async function createPrismaClient(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const usePostgres = !!process.env.VERCEL || !!process.env.POSTGRES_URL

  let client: PrismaClient

  if (usePostgres) {
    const { PrismaPg } = await import('@prisma/adapter-pg')
    const { Pool } = await import('pg')
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL! })
    const adapter = new PrismaPg(pool)
    client = new PrismaClient({ adapter } as any)
  } else {
    const { PrismaBetterSqlite3 } = await import('@prisma/adapter-better-sqlite3')
    const path = await import('path')
    const dbPath = path.join(process.cwd(), 'dev.db')
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
    client = new PrismaClient({ adapter } as any)
  }

  globalForPrisma.prisma = client
  return client
}

// Default export - call createPrismaClient() before using
export const prisma = null as unknown as PrismaClient