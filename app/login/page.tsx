'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

function LoginForm(){
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState(searchParams.get('error') === 'oauth' ? 'Google sign-in could not be completed. Please try again.' : ''); const [loading,setLoading]=useState(false); const [googleLoading,setGoogleLoading]=useState(false)
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setMsg('')
    try { const r=await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:email.trim(),password})}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Unable to log in.'); location.href=safeNext }
    catch(e){setMsg(e instanceof Error?e.message:'Unable to log in.');setLoading(false)}
  }
  async function signInWithGoogle(){
    setGoogleLoading(true); setMsg('')
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`
    const { error } = await supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo } })
    if(error){ setMsg(error.message); setGoogleLoading(false) }
  }
  return <section className="formPage"><div className="eyebrow">Welcome back</div><h1>Log in</h1><button className="btn" type="button" onClick={signInWithGoogle} disabled={googleLoading||loading}>{googleLoading?'Connecting…':'Continue with Google'}</button><div style={{display:'flex',alignItems:'center',gap:12,margin:'18px 0',color:'rgba(255,255,255,.45)',fontSize:12}}><span style={{height:1,flex:1,background:'rgba(255,255,255,.14)'}}/><span>OR</span><span style={{height:1,flex:1,background:'rgba(255,255,255,.14)'}}/></div><form onSubmit={submit}><input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/><input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/><button className="btn primary" type="submit" disabled={loading||googleLoading}>{loading?'Signing in…':'Log in'}</button></form>{msg&&<div className="notice" style={{color:'#ffb4b4'}}>{msg}</div>}<p className="muted">New here? <a href="/signup">Create an account</a></p></section>
}

export default function Login(){
  return <main className="shell"><nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a></nav><Suspense fallback={<section className="formPage"><div className="eyebrow">Welcome back</div><h1>Log in</h1></section>}><LoginForm /></Suspense></main>
}
