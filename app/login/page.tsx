'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm(){
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false)
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setMsg('')
    try { const r=await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:email.trim(),password})}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Unable to log in.'); location.href=safeNext }
    catch(e){setMsg(e instanceof Error?e.message:'Unable to log in.');setLoading(false)}
  }
  return <section className="formPage"><div className="eyebrow">Welcome back</div><h1>Log in</h1><form onSubmit={submit}><input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/><input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"/><button className="btn primary" type="submit" disabled={loading}>{loading?'Signing in…':'Log in'}</button></form>{msg&&<div className="notice" style={{color:'#ffb4b4'}}>{msg}</div>}<p className="muted">New here? <a href="/signup">Create an account</a></p></section>
}

export default function Login(){
  return <main className="shell"><nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a></nav><Suspense fallback={<section className="formPage"><div className="eyebrow">Welcome back</div><h1>Log in</h1></section>}><LoginForm /></Suspense></main>
}
