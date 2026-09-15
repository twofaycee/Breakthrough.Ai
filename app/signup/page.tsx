'use client'

import { useState } from 'react'

export default function Signup(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [msg,setMsg]=useState('')
  const [loading,setLoading]=useState(false)

  async function submit(e:React.FormEvent){
    e.preventDefault()
    if(password.length < 8){ setMsg('Use a password with at least 8 characters.'); return }
    setLoading(true); setMsg('')
    try {
      const r=await fetch('/api/auth/signup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:email.trim(),password})})
      const d=await r.json().catch(()=>({}))
      if(!r.ok) throw new Error(d.error||'Unable to create your account.')
      if(d.instant){ window.location.assign('/'); return }
      setMsg(d.message||'Account created. Check your email to finish signing in.')
    } catch(e) {
      setMsg(e instanceof Error?e.message:'Unable to create your account. Please try again.')
    } finally { setLoading(false) }
  }

  return <main className="shell"><nav className="nav"><a className="brand brandWithMark" href="/"><img src="/brand/breakthrough-mark.svg" alt="" aria-hidden="true"/><span>BREAKTHROUGH</span></a></nav><section className="formPage"><div className="eyebrow">Join the platform</div><h1>Create your account</h1><p className="muted">Start watching stories built for the screen.</p><form onSubmit={submit}><input className="input" placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/><input className="input" placeholder="Password (8+ characters)" type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="new-password"/><button className="btn primary" type="submit" disabled={loading}>{loading?'Creating your account…':'Create account'}</button></form>{msg&&<div className="notice" style={{color:msg.toLowerCase().includes('created')?'#c7f9d4':'#ffb4b4'}}>{msg}</div>}<p className="muted">Already have an account? <a href="/login">Log in</a></p></section></main>
}
