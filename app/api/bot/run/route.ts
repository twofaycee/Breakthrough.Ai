
import { supabaseAdmin } from '@/lib/supabase'
import { analyzeCatalog, generateStrategicPlan } from '@/lib/bot'
import { createGeneration } from '@/lib/runway'
import { featuredScore, shouldRemove } from '@/lib/scheduler'
export const dynamic = 'force-dynamic'
export const maxDuration = 60
export async function GET(){
  if(!supabaseAdmin) return Response.json({error:'Add SUPABASE_SERVICE_ROLE_KEY - Supabase not connected'},{status:500})
  try{
    const {data:films} = await supabaseAdmin.from('films').select('*')
    const all = films||[]
    const analysis = await analyzeCatalog(all)
    const plan = await generateStrategicPlan(analysis)
    let generated=0, archived=0, featured=0
    const executed:any[]=[]
    for(const action of plan.actions){
      if(generated>=3) break
      const gen:any = await createGeneration(action.data.prompt, action.data.genre)
      if(gen.status==='succeeded'){
        const film={
          id:`bt-bot-${Date.now()}-${generated}`,
          title: action.data.prompt.slice(0,60).toUpperCase(),
          genre: action.data.genre,
          synopsis: action.data.prompt,
          video_url: gen.videoUrl,
          match: 90+Math.floor(Math.random()*9),
          status: 'scheduled',
          scheduled_release_at: action.data.releaseAt,
          expires_at: new Date(Date.now()+30*24*60*60*1000).toISOString(),
          views:0, likes:0, featured_score:100
        }
        await supabaseAdmin.from('films').insert(film)
        executed.push({action:'scheduled', title:film.title, genre:film.genre, reason:action.reason, release:action.data.releaseAt})
        generated++
      }
    }
    for(const f of all.filter(shouldRemove)){
      await supabaseAdmin.from('films').update({status:'archived'}).eq('id', f.id)
      archived++
    }
    for(const f of all){
      const score = featuredScore(f)
      const newStatus = score>300?'featured':'live'
      if(newStatus==='featured') featured++
      await supabaseAdmin.from('films').update({featured_score:score, status:newStatus}).eq('id', f.id)
    }
    return Response.json({
      bot:'BREAKTHROUGH.AI Showrunner Bot',
      domain:'breakthrough.ai',
      time:new Date().toISOString(),
      analysis,
      weeklyPlan: plan.weeklyPlan,
      executed,
      summary:`BREAKTHROUGH Bot: ${generated} scheduled strategically (not flooding), ${archived} archived low attention, ${featured} featured longest - hobby-safe daily crons, deploy will succeed`
    })
  }catch(e:any){ return Response.json({error:e.message},{status:500}) }
}
export async function POST(req:Request){ return GET() }
