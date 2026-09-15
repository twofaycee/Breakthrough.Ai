import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib-supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function friendly(message: string) {
  const lower = message.toLowerCase()
  if (lower.includes('rate limit') || lower.includes('email rate') || lower.includes('too many')) return 'Sign-up email delivery is temporarily busy. Please wait a few minutes and try again.'
  if (lower.includes('already registered') || lower.includes('already exists')) return 'An account with this email already exists. Try logging in instead.'
  return message || 'Unable to create your account. Please try again.'
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Use a password with at least 8 characters.' }, { status: 400 })

    const supabase = await supabaseServer()
    const origin = new URL(req.url).origin
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/confirm?next=/`,
        data: { display_name: email.split('@')[0] },
      },
    })

    if (error) {
      const lower = error.message.toLowerCase()
      if (lower.includes('rate limit') || lower.includes('email rate') || lower.includes('too many')) {
        return NextResponse.json({ error: friendly(error.message), code: 'EMAIL_RATE_LIMIT' }, { status: 429, headers: { 'Retry-After': '60' } })
      }
      return NextResponse.json({ error: friendly(error.message) }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      needsConfirmation: !data.session,
      message: data.session ? 'Account created. Welcome to BREAKTHROUGH.' : 'Account created. Check your email to finish signing in.',
    })
  } catch (e) {
    console.error('Signup route failed', e)
    return NextResponse.json({ error: 'We hit a temporary problem creating your account. Please try again.' }, { status: 500 })
  }
}
