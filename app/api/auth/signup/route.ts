
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword, signToken } from '@/lib/auth'
import { validateEmail, validatePassword } from '@/lib/validation'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Rate limiting
  const key = getRateLimitKey(req, 'signup')
  const rl = checkRateLimit(key, RATE_LIMITS.auth)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const { email, password, name } = await req.json()

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const pwCheck = validatePassword(password)
    if (!pwCheck.valid) {
      return NextResponse.json({ error: pwCheck.message }, { status: 400 })
    }

    // Check if user exists
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        name: name || email.split('@')[0],
        role: 'user'
      })
      .select()
      .single()

    if (error) throw error

    const token = await signToken({ id: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    }, { status: 201 })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (err: unknown) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
