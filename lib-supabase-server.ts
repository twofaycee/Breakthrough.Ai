import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unjxaldxkdsilmkkhtvy.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable__ppk6zAxE-qWF0L_krFtyg_AXNMHc4H'

export async function supabaseServer() {
  const jar = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() { return jar.getAll() },
      setAll(list) {
        try { for (const { name, value, options } of list) jar.set(name, value, options) } catch {}
      },
    },
  })
}
