'use client'
import { useState } from 'react'

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false)
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setMsg('')
    try { const r=await fetch('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:email.trim(),password})}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Unable to log in.'); location.href='/' }
    catch(e){setMsg(e instanceof Error?e.message:'Unable to log in.');setLoading(false)}
  }
  return <main className="shell"><nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a></nav><section className="formPage"><div className="eyebrow">Welcome back</div><h1>Log in</h1><form onSubmit={submit}><input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="btn primary" type="submit" disabled={loading}>{loading?'Signing in…':'Log in'}</button></form>{msg&&<div className="notice">{msg}</div>}<p className="muted">New here? <a href="/signup">Create an account</a></p></section></main>
}