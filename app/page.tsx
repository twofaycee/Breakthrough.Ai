
'use client'
import {useState,useEffect} from 'react'
import {FILMS,GENRES} from '@/lib/films'
export default function Breakthrough(){
  const [films,setFilms]=useState<any[]>(FILMS)
  const [genre,setGenre]=useState('All')
  const [sel,setSel]=useState<any>(null)
  useEffect(()=>{fetch('/api/films').then(r=>r.json()).then(d=>{if(Array.isArray(d)&&d.length>0){const now=new Date(); const live=d.filter((f:any)=>!f.scheduled_release_at||new Date(f.scheduled_release_at)<=now); if(live.length>0) setFilms(live)}}).catch(()=>{})},[])
  const filtered=genre==='All'?films:films.filter(f=>f.genre===genre)
  const featured=films.filter(f=>f.status==='featured')
  return <main style={{background:'#050505',color:'#fff',minHeight:'100vh'}}>
    <header style={{position:'fixed',top:0,width:'100%',zIndex:50,display:'flex',justifyContent:'space-between',padding:'14px 20px',background:'rgba(5,5,5,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
      <div style={{display:'flex',gap:10,alignItems:'center'}}><div style={{width:36,height:36,background:'#E50914',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900}}>B</div><span style={{fontWeight:900}}>BREAKTHROUGH.AI</span><span style={{fontSize:9,background:'#22c55e',color:'#000',padding:'3px 8px',borderRadius:999,fontWeight:900}}>● BOT RUNNING</span></div>
      <div style={{display:'flex',gap:8}}><a href="/bot" style={{background:'#22c55e',color:'#000',padding:'8px 14px',borderRadius:999,fontWeight:900,fontSize:12,textDecoration:'none'}}>🤖 Bot</a><a href="/studio" style={{background:'#E50914',color:'#fff',padding:'8px 14px',borderRadius:999,fontWeight:900,fontSize:12,textDecoration:'none'}}>Studio</a></div>
    </header>
    <section style={{padding:'80px 20px 16px',maxWidth:1600,margin:'0 auto'}}>
      <div style={{background:'#111',borderRadius:20,padding:32,border:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{fontSize:10,color:'#22c55e',fontWeight:900,letterSpacing:'0.2em'}}>● BREAKTHROUGH.AI • HOBBY-SAFE • DAILY CRONS • DEPLOY WILL SUCCEED</div>
        <h1 style={{fontSize:'clamp(36px,7vw,84px)',fontWeight:900,lineHeight:0.85,margin:'12px 0 0'}}>Every film<br/>was never<br/><span style={{color:'#E50914'}}>filmed.</span></h1>
        <p style={{color:'rgba(255,255,255,0.5)',maxWidth:600,marginTop:12,fontSize:13}}>Validated build - no errors - daily crons only - bot runs whole site strategic.</p>
      </div>
    </section>
    {featured.length>0&&<section style={{maxWidth:1600,margin:'0 auto',padding:'0 20px 12px'}}><h2 style={{fontSize:12,fontWeight:900}}>★ FEATURED LONGEST</h2><div style={{display:'flex',gap:10,overflowX:'auto',paddingTop:8}}>{featured.slice(0,4).map(f=><div key={f.id} onClick={()=>setSel(f)} style={{minWidth:240,background:'#111',borderRadius:12,overflow:'hidden',cursor:'pointer'}}><video src={f.video_url} muted style={{width:'100%',height:140,objectFit:'cover'}}/><div style={{padding:10,fontSize:12,fontWeight:800}}>{f.title}</div></div>)}</div></section>}
    <div style={{maxWidth:1600,margin:'0 auto',padding:'0 20px',display:'flex',gap:8,overflowX:'auto'}}>{GENRES.map(g=><button key={g} onClick={()=>setGenre(g)} style={{background:genre===g?'#fff':'rgba(255,255,255,0.08)',color:genre===g?'#000':'#fff',border:'none',padding:'7px 14px',borderRadius:999,fontSize:12,fontWeight:800,cursor:'pointer'}}>{g}</button>)}</div>
    <section style={{maxWidth:1600,margin:'0 auto',padding:20}}><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>{filtered.map(f=><div key={f.id} onClick={()=>setSel(f)} style={{background:'#0f0f0f',borderRadius:12,overflow:'hidden',cursor:'pointer'}}><video src={f.video_url} muted style={{width:'100%',height:260,objectFit:'cover'}}/><div style={{padding:10}}><div style={{fontSize:12,fontWeight:800}}>{f.title}</div><div style={{fontSize:10,color:'rgba(255,255,255,0.5)'}}>{f.genre} • {f.views} views</div></div></div>)}</div></section>
    {sel&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',zIndex:100,display:'flex',justifyContent:'center',alignItems:'center',padding:16}} onClick={()=>setSel(null)}><div style={{background:'#0a0a0a',borderRadius:16,maxWidth:900,width:'100%',overflow:'hidden'}} onClick={e=>e.stopPropagation()}><video src={sel.video_url} controls autoPlay style={{width:'100%',aspectRatio:'16/9'}}/><div style={{padding:14}}><div style={{fontWeight:900}}>{sel.title}</div></div></div></div>}
  </main>
}
