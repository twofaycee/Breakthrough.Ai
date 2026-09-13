
import { supabaseAdmin } from '@/lib/supabase'
import { createGeneration } from '@/lib/runway'
export const dynamic = 'force-dynamic'
export async function POST(req:Request){
  try{
    const {prompt, genre} = await req.json()
    if(!prompt) return Response.json({error:'Prompt required'},{status:400})
    if(!supabaseAdmin) return Response.json({error:'Add Supabase env vars - SUPABASE_SERVICE_ROLE_KEY missing'},{status:500})
    const gen:any = await createGeneration(prompt, genre||'Drama')
    const film={
      id:`bt-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      title: prompt.slice(0,60).toUpperCase(),
      genre: genre||'Drama',
      synopsis: prompt,
      video_url: gen.videoUrl,
      match: 95,
      status: 'scheduled',
      scheduled_release_at: new Date(Date.now()+2*60*60*1000).toISOString(),
      expires_at: new Date(Date.now()+30*24*60*60*1000).toISOString(),
      views:0, likes:0, featured_score:100
    }
    const {error} = await supabaseAdmin.from('films').insert(film)
    if(error) return Response.json({error:error.message},{status:500})
    return Response.json({status:'succeeded', film, video_url:film.video_url, message:'BREAKTHROUGH film scheduled for release in 2h - strategic not flooding'})
  }catch(e:any){ return Response.json({error:e.message},{status:500}) }
}
