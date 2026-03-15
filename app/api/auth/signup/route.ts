import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const rl = await checkRateLimit(ip, 'signup', 5, 60)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000).toString() } }
      )
    }

    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const user = await createUser(email, password, name)
    return NextResponse.json({ message: 'Account created successfully', userId: user.id }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'User already exists') {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
