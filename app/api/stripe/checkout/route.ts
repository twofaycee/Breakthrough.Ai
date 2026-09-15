import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unjxaldxkdsilmkkhtvy.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable__ppk6zAxE-qWF0L_krFtyg_AXNMHc4H'

export async function GET(request: Request) {
  try {
    const jar = await cookies()
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll() { return jar.getAll() },
        setAll(list) {
          try { for (const { name, value, options } of list) jar.set(name, value, options) } catch {}
        },
      },
    })
    const { data: { user } } = await supabase.auth.getUser()
    const origin = new URL(request.url).origin

    if (!user) return NextResponse.redirect(new URL('/login?next=%2Fpricing', origin))

    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'Pro billing is not configured yet. Please try again shortly.' }, { status: 503 })

    const price = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1UFQLuFxJNzSfEVrLFDm1v2s'
    const body = new URLSearchParams({
      mode: 'subscription',
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      client_reference_id: user.id,
      'line_items[0][price]': price,
      'line_items[0][quantity]': '1',
      'metadata[user_id]': user.id,
      'subscription_data[metadata][user_id]': user.id,
    })
    if (user.email) body.set('customer_email', user.email)

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    })
    const data = await stripeResponse.json()

    if (!stripeResponse.ok || !data.url) {
      console.error('Stripe checkout failed', data)
      return NextResponse.json({ error: data?.error?.message || 'Stripe checkout failed.' }, { status: 502 })
    }

    return NextResponse.redirect(data.url)
  } catch (error) {
    console.error('Stripe checkout route failed', error)
    return NextResponse.json({ error: 'Unable to start Pro checkout. Please try again.' }, { status: 500 })
  }
}
