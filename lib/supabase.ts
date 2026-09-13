import {createClient} from '@supabase/supabase-js'
const url=process.env.NEXT_PUBLIC_SUPABASE_URL
const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase=url&&anon?createClient(url,anon):null
export const supabaseAdmin=process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY?createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY):null
