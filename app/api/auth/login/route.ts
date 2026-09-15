import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib-supabase-server'

export async function POST(req:Request){
  try {
    const body=await req.json()
    if(!body.email||!body.password) return NextResponse.json({error:'Email and password are required.'},{status:400})
    const supa=await supabaseServer()
    const {error}=await supa.auth.signInWithPassword({email:String(body.email).trim(),password:String(body.password)})
    if(error) return NextResponse.json({error:error.message},{status:400})
    return NextResponse.json({ok:true})
  } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Login failed.'},{status:500}) }
}