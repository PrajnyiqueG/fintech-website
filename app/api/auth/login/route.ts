
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword, signToken } from '@/lib/auth'
import { validateEmail } from '@/lib/validation'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const key = getRateLimitKey(req, 'login')
  const rl = checkRateLimit(key, RATE_LIMITS.auth)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 })
  }

  try {
    const { email, password } = await req.json()

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role, password_hash')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const hashedInput = await hashPassword(password)
    if (hashedInput !== user.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signToken({ id: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return response
  } catch (err: unknown) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
