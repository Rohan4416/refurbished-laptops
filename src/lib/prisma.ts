import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export async function createPrismaClient(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const dbPath = path.join(process.cwd(), 'dev.db')
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
  const client = new PrismaClient({ adapter })

  globalForPrisma.prisma = client
  return client
}

export const prisma = null as unknown as PrismaClient