
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateContactForm, sanitizeHtml } from '@/lib/validation'
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const key = getRateLimitKey(req, 'contact')
  const rl = checkRateLimit(key, RATE_LIMITS.contact)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const { name, email, message, subject, honeypot } = body

    // Validate
    const validation = validateContactForm({ name, email, message, honeypot })
    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

    // Store in database
    const { data: submission, error } = await supabaseAdmin
      .from('contact_submissions')
      .insert({
        name: sanitizeHtml(name.trim()),
        email: email.toLowerCase().trim(),
        subject: subject ? sanitizeHtml(subject.trim()) : 'General Inquiry',
        message: sanitizeHtml(message.trim()),
        ip_address: ip,
        status: 'new'
      })
      .select()
      .single()

    if (error) throw error

    // Send notification email via Supabase Edge Function (if configured)
    const notifyEmail = process.env.NOTIFY_EMAIL
    if (notifyEmail) {
      try {
        await supabaseAdmin.functions.invoke('send-notification', {
          body: {
            to: notifyEmail,
            subject: `New Contact Form: ${submission.subject}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> ${submission.email}</p>
              <p><strong>Subject:</strong> ${submission.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${submission.message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><small>Submitted at ${new Date().toISOString()} from IP ${ip}</small></p>
            `
          }
        })
      } catch (notifyErr) {
        console.warn('Notification failed (non-fatal):', notifyErr)
      }
    }

    return NextResponse.json({
      message: 'Your message has been sent successfully! We will get back to you soon.',
      id: submission.id
    }, { status: 201 })
  } catch (err: unknown) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
