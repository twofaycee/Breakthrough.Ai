import {supabaseAdmin} from '@/lib/supabase'
import {shouldRemove} from '@/lib/scheduler'
export async function GET(){if(!supabaseAdmin) return Response.json({error:'No supabase'});const {data:films}=await supabaseAdmin.from('films').select('*');const toRemove=(films||[]).filter(shouldRemove);for(const f of toRemove) await supabaseAdmin.from('films').update({status:'archived'}).eq('id',f.id);return Response.json({archived:toRemove.length})}
