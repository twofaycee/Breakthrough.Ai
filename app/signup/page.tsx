'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)

export default function Signup(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [phone,setPhone]=useState(''); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false); const [oauthLoading,setOauthLoading]=useState(''); const [phoneLoading,setPhoneLoading]=useState(false)
  async function submit(e:React.FormEvent){
    e.preventDefault(); if(password.length < 8){ setMsg('Use a password with at least 8 characters.'); return }; setLoading(true); setMsg('')
    try { const r=await fetch('/api/auth/signup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:email.trim(),password})}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Unable to create your account.'); if(d.instant){ window.location.assign('/'); return }; setMsg(d.message||'Account created. Check your email to finish signing in.') } catch(e){setMsg(e instanceof Error?e.message:'Unable to create your account. Please try again.')} finally{setLoading(false)}
  }
  async function signUpWithProvider(provider:'google'|'apple'){
    setOauthLoading(provider); setMsg(''); const redirectTo=`${window.location.origin}/auth/callback?next=${encodeURIComponent('/')}`
    const {error}=await supabase.auth.signInWithOAuth({provider,options:{redirectTo}}); if(error){setMsg(error.message);setOauthLoading('')}
  }
  async function signUpWithPhone(e:React.FormEvent){
    e.preventDefault(); setPhoneLoading(true); setMsg('')
    const {error}=await supabase.auth.signInWithOtp({phone:phone.trim()})
    if(error){setMsg(error.message);setPhoneLoading(false);return}
    setMsg('Verification code sent. Enter the code from your text message.')
    setPhoneLoading(false)
  }
  return <main className="shell"><nav className="nav"><a className="brand brandWithMark" href="/"><img src="/brand/breakthrough-mark.svg" alt="" aria-hidden="true"/><span>BREAKTHROUGH</span></a></nav><section className="formPage"><div className="eyebrow">Join the platform</div><h1>Create your account</h1><p className="muted">Start watching stories built for the screen.</p><button className="btn" type="button" onClick={()=>signUpWithProvider('google')} disabled={!!oauthLoading||loading||phoneLoading}>{oauthLoading==='google'?'Connecting…':'Continue with Google'}</button><button className="btn" type="button" onClick={()=>signUpWithProvider('apple')} disabled={!!oauthLoading||loading||phoneLoading} style={{marginTop:10}}>{oauthLoading==='apple'?'Connecting…':'Continue with Apple'}</button><div style={{display:'flex',alignItems:'center',gap:12,margin:'18px 0',color:'rgba(255,255,255,.45)',fontSize:12}}><span style={{height:1,flex:1,background:'rgba(255,255,255,.14)'}}/><span>OR</span><span style={{height:1,flex:1,background:'rgba(255,255,255,.14)'}}/></div><form onSubmit={submit}><input className="input" placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/><input className="input" placeholder="Password (8+ characters)" type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="new-password"/><button className="btn primary" type="submit" disabled={loading||!!oauthLoading||phoneLoading}>{loading?'Creating your account…':'Create account'}</button></form><div style={{display:'flex',alignItems:'center',gap:12,margin:'18px 0',color:'rgba(255,255,255,.45)',fontSize:12}}><span style={{height:1,flex:1,background:'rgba(255,255,255,.14)'}}/><span>OR</span><span style={{height:1,flex:1,background:'rgba(255,255,255,.14)'}}/></div><form onSubmit={signUpWithPhone}><input className="input" placeholder="Phone number (+1 555 123 4567)" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} required autoComplete="tel"/><button className="btn" type="submit" disabled={phoneLoading||loading||!!oauthLoading}>{phoneLoading?'Sending code…':'Continue with phone'}</button></form>{msg&&<div className="notice" style={{color:msg.toLowerCase().includes('sent')||msg.toLowerCase().includes('created')?'#c7f9d4':'#ffb4b4'}}>{msg}</div>}<p className="muted">Already have an account? <a href="/login">Log in</a></p></section></main>
}
