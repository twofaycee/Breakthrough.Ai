import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib-supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')

    if (!email || !password) {
      return NextResponse.json({ error: 'Enter your email and a password.' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Your password must be at least 6 characters.' }, { status: 400 })
    }

    const supa = await supabaseServer()
    const { data, error } = await supa.auth.signUp({ email, password })

    if (error) {
      const message = error.message || ''
      const lower = message.toLowerCase()
      if (lower.includes('rate limit') || lower.includes('email rate') || lower.includes('too many requests')) {
        return NextResponse.json({
          error: 'Email signup is temporarily busy. Please wait a little and try again. You do not need to create another account if you already received a confirmation email.',
          code: 'EMAIL_RATE_LIMIT',
        }, { status: 429, headers: { 'Retry-After': '60' } })
      }
      if (lower.includes('already registered') || lower.includes('already been registered')) {
        return NextResponse.json({ error: 'An account with this email already exists. Try logging in instead.', code: 'ACCOUNT_EXISTS' }, { status: 409 })
      }
      return NextResponse.json({ error: message || 'Unable to create your account. Please try again.' }, { status: 400 })
    }

    return NextResponse.json({
      ok: true,
      needsConfirmation: !data.session,
      message: data.session
        ? 'Account created. Welcome to BREAKTHROUGH.'
        : 'Account created. Check your email to finish signing in.',
    })
  } catch (e) {
    console.error('Signup route failed', e)
    return NextResponse.json({ error: 'We hit a temporary problem creating your account. Please try again.' }, { status: 500 })
  }
}
