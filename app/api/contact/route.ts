import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db'
import { checkRateLimit } from '@/lib/rate-limit'
import { checkSpam } from '@/lib/spam-check'

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const rl = await checkRateLimit(ip, 'contact', 3, 60)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many contact form submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, email, subject, message, honeypot, submittedAt } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (name.length > 100 || message.length > 5000) {
      return NextResponse.json({ error: 'Input exceeds maximum length' }, { status: 400 })
    }

    const spamResult = checkSpam({ name, email, message, honeypot, submittedAt })

    const { data: submission, error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        subject: subject?.trim() || null,
        message: message.trim(),
        ip_address: ip,
        status: spamResult.isSpam ? 'spam' : 'new',
        spam_score: spamResult.score
      })
      .select()
      .single()

    if (dbError) throw dbError

    if (!spamResult.isSpam) {
      // Send notification email via Supabase Edge Function or direct SMTP
      const notificationEmail = process.env.NOTIFICATION_EMAIL
      if (notificationEmail) {
        await supabaseAdmin.functions.invoke('send-contact-notification', {
          body: {
            to: notificationEmail,
            submission: { name, email, subject, message, id: submission.id }
          }
        }).catch(err => console.warn('Notification failed:', err))
      }
    }

    return NextResponse.json({
      message: 'Thank you for your message! We will get back to you soon.',
      id: submission.id
    }, { status: 201 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'new'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = (page - 1) * limit

    const { data, error, count } = await supabaseAdmin
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return NextResponse.json({ submissions: data, total: count, page })
  } catch (error) {
    console.error('Contact list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
