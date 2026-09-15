import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unjxaldxkdsilmkkhtvy.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable__ppk6zAxE-qWF0L_krFtyg_AXNMHc4H'
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(url, key)
export const supabaseAdmin = service ? createClient(url, service) : null
