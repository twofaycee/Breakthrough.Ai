'use client'
import {useState} from 'react'

export default function ContentEngine(){
 const [title,setTitle]=useState('The Last Signal')
 const [genre,setGenre]=useState('Mystery Thriller')
 const [logline,setLogline]=useState('A night-shift radio host receives a call from a woman who died ten years ago, and the caller knows exactly what will happen next.')
 const [runtime,setRuntime]=useState('64')
 const [mode,setMode]=useState<'review'|'auto'>('review')
 const [busy,setBusy]=useState(false)
 const [result,setResult]=useState<any>(null)
 const [error,setError]=useState('')
 const run=async()=>{setBusy(true);setError('');setResult(null);try{const r=await fetch('/api/admin/content-engine',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,genre,logline,runtimeSeconds:Number(runtime),mode})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to create production');setResult(d)}catch(e){setError(e instanceof Error?e.message:'Unable to create production')}finally{setBusy(false)}}
 return <section className="section" style={{paddingTop:35}}>
  <div className="sectionHead"><div><div className="eyebrow">CONTENT ENGINE</div><h2>Build a production package</h2><p className="muted">Concept → screenplay → cast universe → scene plan → quality gate.</p></div><span className="tag">{mode==='review'?'REVIEW MODE':'AUTO MODE'}</span></div>
  <div className="grid" style={{gridTemplateColumns:'minmax(0,1.4fr) minmax(300px,.8fr)'}}>
   <div className="panel">
    <label className="muted">Production title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{width:'100%',marginTop:7}}/>
    <label className="muted" style={{display:'block',marginTop:16}}>Genre</label><input value={genre} onChange={e=>setGenre(e.target.value)} placeholder="Mystery Thriller" style={{width:'100%',marginTop:7}}/>
    <label className="muted" style={{display:'block',marginTop:16}}>Logline</label><textarea value={logline} onChange={e=>setLogline(e.target.value)} rows={5} style={{width:'100%',marginTop:7,resize:'vertical'}}/>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}><div><label className="muted">Runtime</label><select value={runtime} onChange={e=>setRuntime(e.target.value)} style={{width:'100%',marginTop:7}}><option value="48">48 sec</option><option value="56">56 sec</option><option value="64">64 sec</option><option value="72">72 sec</option></select></div><div><label className="muted">Production mode</label><select value={mode} onChange={e=>setMode(e.target.value as any)} style={{width:'100%',marginTop:7}}><option value="review">Review before video</option><option value="auto">Auto after QA</option></select></div></div>
    <button className="btn primary" onClick={run} disabled={busy} style={{marginTop:20}}>{busy?'Building package…':'Create production package'}</button>
    {error&&<p style={{marginTop:14}}>{error}</p>}
   </div>
   <div className="panel"><div className="eyebrow">QUALITY GATE</div><h3>What the engine enforces</h3><ul className="muted" style={{lineHeight:1.8,paddingLeft:18}}><li>Strong opening hook</li><li>Distinct cast universe per production</li><li>Scene-level character assignments</li><li>Continuity notes for wardrobe, props, geography</li><li>Structured screenplay before video spend</li><li>Reject weak concepts before generation</li></ul></div>
  </div>
  {result&&<div className="panel" style={{marginTop:18}}><div className="eyebrow">PACKAGE CREATED</div><h3>{result.title?.title}</h3><p className="muted">{result.sceneCount} scenes · {result.castCount} characters · quality gate {result.quality?.decision}</p><div className="grid" style={{marginTop:16}}><div><strong>Production ID</strong><p className="muted">{result.planId}</p></div><div><strong>Artifact ID</strong><p className="muted">{result.artifactId}</p></div></div></div>}
 </section>
}
