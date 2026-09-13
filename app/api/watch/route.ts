
import { supabaseAdmin } from '@/lib/supabase'
export const dynamic='force-dynamic'
export async function POST(req:Request){
  try{
    const {filmId, genre, duration}=await req.json()
    if(!supabaseAdmin) return Response.json({success:true, mock:true})
    await supabaseAdmin.from('watch_events').insert({film_id:filmId, genre, watch_duration:duration||30})
    const {data:f}=await supabaseAdmin.from('films').select('views').eq('id',filmId).single()
    if(f) await supabaseAdmin.from('films').update({views:(f.views||0)+1}).eq('id',filmId)
    return Response.json({success:true})
  }catch(e:any){ return Response.json({success:true}) }
}
