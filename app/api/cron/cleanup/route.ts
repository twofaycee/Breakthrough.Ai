import {supabaseAdmin} from '@/lib/supabase'
import {shouldRemove} from '@/lib/scheduler'
export const dynamic='force-dynamic'
export async function GET(){if(!supabaseAdmin) return Response.json({ok:true});const {data:films}=await supabaseAdmin.from('films').select('*');for(const f of (films||[]).filter(shouldRemove)) await supabaseAdmin.from('films').update({status:'archived'}).eq('id',f.id);return Response.json({ok:true})}
