import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

interface Settings {
  [key: string]: unknown;
}

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json')

async function getSettings(): Promise<Settings> {
  try {
    const data = await readFile(SETTINGS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

async function saveSettings(settings: Settings): Promise<void> {
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    await saveSettings(body)
    return NextResponse.json({ success: true, settings: body })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}