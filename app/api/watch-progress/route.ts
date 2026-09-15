import {NextResponse} from 'next/server'
import {createAdminClient} from '@/lib/supabase/admin'
import {supabaseServer} from '@/lib-supabase-server'

export const runtime='nodejs'
export async function POST(req:Request){
 try{
  const {data:{user}}=await supabaseServer().auth.getUser()
  if(!user)return NextResponse.json({error:'Sign in required'},{status:401})
  const body=await req.json();const titleId=String(body.titleId||'');const progress=Math.max(0,Math.floor(Number(body.progressSeconds)||0));const duration=Math.max(0,Math.floor(Number(body.durationSeconds)||0))
  if(!titleId)return NextResponse.json({error:'Title is required'},{status:400})
  const completed=duration>0&&progress>=Math.max(0,duration-5)
  const admin=createAdminClient()
  const {error}=await admin.from('watch_history').upsert({user_id:user.id,title_id:titleId,progress_seconds:progress,duration_seconds:duration,completed,updated_at:new Date().toISOString()},{onConflict:'user_id,title_id'})
  if(error)throw error
  return NextResponse.json({ok:true,completed})
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to save progress'},{status:500})}
}
