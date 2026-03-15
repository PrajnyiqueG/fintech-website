import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await requireAdmin(req)
    const body = await req.json().catch(() => ({}))
    const action = body.action || 'publish'

    if (!['publish', 'unpublish'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Use publish or unpublish' }, { status: 400 })
    }

    const newStatus = action === 'publish' ? 'published' : 'draft'
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    }
    if (action === 'publish') {
      updateData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update(updateData)
      .eq('slug', params.slug)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: `Post ${action}ed successfully`,
      post: data
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    console.error('Blog publish error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
