import { NextRequest, NextResponse } from 'next/server'
import { logoutSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (token) {
      await logoutSession(token)
    }
    const response = NextResponse.json({ message: 'Logged out successfully' })
    response.cookies.delete('auth_token')
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
