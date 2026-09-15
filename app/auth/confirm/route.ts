import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib-supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function safeNext(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const tokenHash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const next = safeNext(url.searchParams.get('next'))

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL('/auth/confirmation-error', request.url))
  }

  try {
    const supabase = await supabaseServer()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) return NextResponse.redirect(new URL(`/auth/confirmed?next=${encodeURIComponent(next)}`, request.url))
  } catch (error) {
    console.error('Email confirmation failed', error)
  }

  return NextResponse.redirect(new URL('/auth/confirmation-error', request.url))
}
