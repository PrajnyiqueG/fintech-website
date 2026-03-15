
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const userPayload = await getCurrentUser()
    if (!userPayload) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role, created_at')
      .eq('id', userPayload.id)
      .single()

    return NextResponse.json({ user })
  } catch (err: unknown) {
    console.error('Get user error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
