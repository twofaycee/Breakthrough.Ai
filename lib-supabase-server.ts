import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unjxaldxkdsilmkkhtvy.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!key) throw new Error('Supabase publishable key is not configured in Vercel.')
  const jar = await cookies()
  return createServerClient(url, key, {
    cookies: {
      getAll() { return jar.getAll() },
      setAll(list) {
        try { for (const { name, value, options } of list) jar.set(name, value, options) } catch {}
      },
    },
  })
}
