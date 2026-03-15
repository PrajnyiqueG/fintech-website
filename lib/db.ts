import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface AppUser {
  id: string
  email: string
  password_hash: string
  name: string | null
  role: 'user' | 'admin'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  tags: string[]
  cover_image: string | null
  meta_description: string | null
  view_count: number
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  ip_address: string | null
  status: 'new' | 'read' | 'replied' | 'spam'
  spam_score: number
  created_at: string
}
