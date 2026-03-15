
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

// List all blog posts (admin)
export async function GET() {
  try {
    await requireAdmin()

    const { data: posts, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ posts })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

// Create new blog post
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    const { title, slug, content, excerpt, tags, cover_image, published } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()

    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        title,
        slug: finalSlug,
        content,
        excerpt: excerpt || content.substring(0, 160),
        tags: tags || [],
        cover_image,
        published: published || false,
        published_at: published ? new Date().toISOString() : null,
        author_id: admin.id,
        author_name: admin.email
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ post }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
