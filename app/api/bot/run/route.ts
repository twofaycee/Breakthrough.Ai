import {supabaseAdmin} from '@/lib/supabase'
import {analyzeCatalog,generateStrategicPlan} from '@/lib/bot'
import {createGeneration} from '@/lib/runway'
import {featuredScore,shouldRemove} from '@/lib/scheduler'
export const dynamic='force-dynamic'
export const maxDuration=60
/** BREAKTHROUGH.AI Bot - Hobby safe daily cron */
export async function GET(){
  if(!supabaseAdmin) return Response.json({error:'Add SUPABASE_SERVICE_ROLE_KEY'},{status:500})
  const {data:films}=await supabaseAdmin.from('films').select('*')
  const all=films||[]
  const analysis=await analyzeCatalog(all)
  const plan=await generateStrategicPlan(analysis)
  let gen=0,arch=0,feat=0
  for(const a of plan.actions){
    if(gen>=3) break
    const g:any=await createGeneration(a.data.prompt,a.data.genre)
    const film={id:`bt-${Date.now()}-${gen}`,title:a.data.prompt.slice(0,60).toUpperCase(),genre:a.data.genre,synopsis:a.data.prompt,video_url:g.videoUrl,status:'scheduled',scheduled_release_at:a.data.releaseAt}
    await supabaseAdmin.from('films').insert(film)
    gen++
  }
  for(const f of all.filter(shouldRemove)){await supabaseAdmin.from('films').update({status:'archived'}).eq('id',f.id);arch++}
  for(const f of all){const s=featuredScore(f);await supabaseAdmin.from('films').update({featured_score:s,status:s>300?'featured':'live'}).eq('id',f.id); if(s>300) feat++}
  return Response.json({bot:'BREAKTHROUGH.AI',summary:`${gen} scheduled, ${arch} archived, ${feat} featured - deploy fixed`,analysis})
}
export async function POST(req:Request){return GET()}
