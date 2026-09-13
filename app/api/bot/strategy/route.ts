import {supabaseAdmin} from '@/lib/supabase'
import {analyzeCatalog,generateStrategicPlan} from '@/lib/bot'
export async function GET(){if(!supabaseAdmin) return Response.json({error:'No supabase'});const {data:films}=await supabaseAdmin.from('films').select('*');const analysis=await analyzeCatalog(films||[]);const plan=await generateStrategicPlan(analysis);return Response.json(plan)}
