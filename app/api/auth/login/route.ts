import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const rl = await checkRateLimit(ip, 'login', 10, 15)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const { user, token } = await loginUser(email, password, req)

    const response = NextResponse.json({ message: 'Login successful', user })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    return response
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
