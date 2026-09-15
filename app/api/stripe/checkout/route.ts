import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib-supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await supabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    const origin = new URL(request.url).origin
    if (!user) return NextResponse.redirect(new URL('/login?next=%2Fpricing', origin))

    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) return NextResponse.json({ error: 'Pro billing is not configured yet. Please try again shortly.' }, { status: 503 })

    const price = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1UFQLuFxJNzSfEVrLFDm1v2s'
    const body = new URLSearchParams({
      mode: 'subscription',
      success_url: `${origin}/account?checkout=success`,
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
