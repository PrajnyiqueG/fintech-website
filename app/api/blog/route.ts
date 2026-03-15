import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'published'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('blog_posts')
      .select('id, title, slug, excerpt, status, published_at, tags, cover_image, view_count, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Only admins can see non-published posts
    if (status !== 'published') {
      try {
        await requireAdmin(req)
        query = query.eq('status', status)
      } catch {
        query = query.eq('status', 'published')
      }
    } else {
      query = query.eq('status', 'published')
    }

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({
      posts: data,
      total: count,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Blog list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const { title, slug, content, excerpt, tags, cover_image, meta_description, status = 'draft' } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert({
        title, slug, content, excerpt, tags: tags || [],
        cover_image, meta_description, status,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ post: data }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error('Blog create error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
