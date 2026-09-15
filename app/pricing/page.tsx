'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Pricing(){
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')

  async function startPro(){
    setLoading(true); setError('')
    try {
      const response=await fetch('/api/stripe/checkout',{method:'GET',cache:'no-store'})
      if(response.redirected){ window.location.assign(response.url); return }
      const data=await response.json().catch(()=>({}))
      if(!response.ok) throw new Error(data.error || 'Unable to start Pro checkout.')
      if(data.url) window.location.assign(data.url)
      else throw new Error('Stripe did not return a checkout URL.')
    }catch(e){
      setError(e instanceof Error ? e.message : 'Unable to start Pro checkout.')
      setLoading(false)
    }
  }

  return <main className="shell"><nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a><div className="actions"><a className="btn" href="/">Home</a></div></nav><section className="formPage"><div className="eyebrow">Membership</div><h1>BREAKTHROUGH Pro</h1><div className="panel"><div className="price">$9.99<span className="muted" style={{fontSize:16}}>/month</span></div><p className="muted">No ads. Full catalog access. Cancel anytime.</p><button className="btn primary" onClick={startPro} disabled={loading}>{loading?'Opening checkout…':'Start Pro'}</button>{error&&<p className="notice" style={{marginTop:12,color:'#ffb4b4'}}>{error}</p>}</div><div className="notice">Free members can watch with ads. Pro removes ads.</div></section></main>
}