
'use client'
import {useEffect,useState} from 'react'
export default function Bot(){
  const [strat,setStrat]=useState<any>(null)
  const [last,setLast]=useState<any>(null)
  const [run,setRun]=useState(false)
  useEffect(()=>{fetch('/api/bot/strategy').then(r=>r.json()).then(d=>setStrat(d))},[])
  const runBot=async()=>{setRun(true);const r=await fetch('/api/bot/run');const d=await r.json();setLast(d);setRun(false)}
  return <main style={{background:'#050505',color:'#fff',minHeight:'100vh',padding:24}}>
    <a href='/' style={{color:'#fff',fontWeight:900,textDecoration:'none',fontSize:14}}><span style={{background:'#E50914',padding:'4px 8px',borderRadius:6,marginRight:8}}>B</span>BREAKTHROUGH.AI • BOT RUNS SITE</a>
    <h1 style={{fontSize:36,fontWeight:900,marginTop:20}}>🤖 Breakthrough.ai Showrunner Bot</h1>
    <p style={{color:'rgba(255,255,255,0.5)',maxWidth:700,fontSize:13}}>Domain breakthrough.ai • Bot runs whole site like Netflix programming team. Strategic organized releases, not non-stop flooding.</p>
    <button onClick={runBot} disabled={run} style={{marginTop:16,background:'#22c55e',color:'#000',border:'none',padding:'14px 28px',borderRadius:999,fontWeight:900,cursor:'pointer'}}>{run?'Running Breakthrough.ai...':'▶ Run Breakthrough Bot Now'}</button>
    {last&&<div style={{marginTop:20,background:'#0a0a0a',padding:16,borderRadius:12,border:'1px solid #22c55e'}}><div style={{fontWeight:900,color:'#22c55e'}}>{last.summary}</div><pre style={{fontSize:11,whiteSpace:'pre-wrap',marginTop:10}}>{JSON.stringify(last.executed,null,2)}</pre><div style={{marginTop:10,fontSize:11}}>Weekly: {last.weeklyPlan?.map((p:any)=>p.day+':'+p.genre).join(' • ')}</div></div>}
    {strat&&<div style={{marginTop:28}}><h2 style={{fontSize:13,fontWeight:900}}>📅 Strategic Weekly Plan for breakthrough.ai</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10,marginTop:12}}>{strat.weeklyPlan?.map((d:any)=><div key={d.day} style={{background:'#111',padding:14,borderRadius:12}}><div style={{fontWeight:900,fontSize:12}}>{d.day} {d.slot}</div><div style={{color:'#E50914',fontWeight:800,marginTop:4}}>{d.genre}</div><div style={{fontSize:10,color:'rgba(255,255,255,0.5)',marginTop:6}}>{d.reason}</div></div>)}</div></div>}
  </main>
}
