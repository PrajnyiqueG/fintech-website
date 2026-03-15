
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: post, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .or(`id.eq.${id},slug.eq.${id}`)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment view count
    await supabaseAdmin
      .from('blog_posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id)

    return NextResponse.json({ post })
  } catch (err: unknown) {
    console.error('Blog get error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
