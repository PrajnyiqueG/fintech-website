import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Only return published posts to non-admins
    if (data.status !== 'published') {
      try {
        await requireAdmin(req)
      } catch {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
    }

    // Increment view count
    await supabaseAdmin
      .from('blog_posts')
      .update({ view_count: data.view_count + 1 })
      .eq('id', data.id)

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Blog get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin(req)
    const body = await req.json()
    const { title, content, excerpt, tags, cover_image, meta_description } = body

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update({ title, content, excerpt, tags, cover_image, meta_description, updated_at: new Date().toISOString() })
      .eq('slug', params.slug)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ post: data })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error('Blog update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin(req)
    const { error } = await supabaseAdmin
      .from('blog_posts')
      .delete()
      .eq('slug', params.slug)

    if (error) throw error
    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error('Blog delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
