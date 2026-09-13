
import { supabaseAdmin } from '@/lib/supabase'
import { shouldRemove } from '@/lib/scheduler'
export const dynamic='force-dynamic'
export async function GET(){
  if(!supabaseAdmin) return Response.json({ok:true, mock:true})
  const {data:films}=await supabaseAdmin.from('films').select('*')
  let archived=0
  for(const f of (films||[]).filter(shouldRemove)){ await supabaseAdmin.from('films').update({status:'archived'}).eq('id',f.id); archived++ }
  return Response.json({archived, ok:true})
}
