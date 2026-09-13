import {supabaseAdmin} from '@/lib/supabase'
import {featuredScore} from '@/lib/scheduler'
export async function GET(){if(!supabaseAdmin) return Response.json({error:'No supabase'});const {data:films}=await supabaseAdmin.from('films').select('*');let feat=0;for(const f of films||[]){const s=featuredScore(f);const ns=s>300?'featured':'live';if(ns==='featured') feat++;await supabaseAdmin.from('films').update({featured_score:s,status:ns}).eq('id',f.id)}return Response.json({featured:feat})}
