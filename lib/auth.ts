import { supabaseAdmin } from './db'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest } from 'next/server'

const SESSION_DURATION_DAYS = 7

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name?: string, role = 'user') {
  const { data: existing } = await supabaseAdmin
    .from('app_users')
    .select('id')
    .eq('email', email)
    .single()
  if (existing) throw new Error('User already exists')

  const passwordHash = await hashPassword(password)
  const { data, error } = await supabaseAdmin
    .from('app_users')
    .insert({ email, password_hash: passwordHash, name, role })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function loginUser(email: string, password: string, req?: NextRequest) {
  const { data: user, error } = await supabaseAdmin
    .from('app_users')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single()

  if (error || !user) throw new Error('Invalid email or password')

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) throw new Error('Invalid email or password')

  const token = uuidv4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      ip_address: req?.ip || req?.headers.get('x-forwarded-for') || null,
      user_agent: req?.headers.get('user-agent') || null
    })
    .select()
    .single()

  if (sessionError) throw new Error(sessionError.message)
  const { password_hash: _, ...safeUser } = user
  return { user: safeUser, session, token }
}

export async function validateSession(token: string) {
  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .select('*, app_users(*)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !session) return null
  const user = (session as any).app_users
  if (!user || !user.is_active) return null
  const { password_hash: _, ...safeUser } = user
  return { user: safeUser, session }
}

export async function logoutSession(token: string) {
  await supabaseAdmin.from('sessions').delete().eq('token', token)
}

export async function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '') ||
    ''
  if (!token) return null
  return validateSession(token)
}

export async function requireAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireAdmin(req: NextRequest) {
  const session = await requireAuth(req)
  if (session.user.role !== 'admin') throw new Error('Forbidden')
  return session
}
