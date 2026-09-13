import {FILMS} from '@/lib/films'
import {supabase} from '@/lib/supabase'
export const dynamic='force-dynamic'
export async function GET(){try{if(supabase){const {data}=await supabase.from('films').select('*').order('featured_score',{ascending:false});if(data&&data.length>0) return Response.json(data)}}catch{}return Response.json(FILMS)}
