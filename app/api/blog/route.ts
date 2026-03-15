
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const key = getRateLimitKey(req, 'blog-list')
  const rl = checkRateLimit(key, RATE_LIMITS.api)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const offset = (page - 1) * limit

    const { data: posts, error, count } = await supabaseAdmin
      .from('blog_posts')
      .select('id, title, slug, excerpt, author_name, published_at, tags, cover_image', { count: 'exact' })
      .eq('published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      posts,
      pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) }
    })
  } catch (err: unknown) {
    console.error('Blog list error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
