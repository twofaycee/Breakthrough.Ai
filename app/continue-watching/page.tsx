'use client'

import {useEffect,useState} from 'react'
import {supabase} from '@/lib/supabase'

const titles=[
 {id:'the-general',title:'The General',year:'1926',genre:'Comedy · War · Romance'},
 {id:'his-girl-friday',title:'His Girl Friday',year:'1940',genre:'Comedy · Romance · Crime'},
 {id:'night-of-the-living-dead',title:'Night of the Living Dead',year:'1968',genre:'Horror · Zombie'},
 {id:'detour',title:'Detour',year:'1945',genre:'Film Noir · Crime · Thriller'},
 {id:'the-stranger',title:'The Stranger',year:'1946',genre:'Film Noir · Mystery · Thriller'},
 {id:'charade',title:'Charade',year:'1963',genre:'Mystery · Romance · Comedy'}
]

export default function ContinueWatching(){
 const [items,setItems]=useState<any[]>([]),[user,setUser]=useState(false),[loading,setLoading]=useState(true)
 useEffect(()=>{(async()=>{if(!supabase){setLoading(false);return}const {data:{user}}=await supabase.auth.getUser();if(!user){setLoading(false);return}setUser(true);const {data}=await supabase.from('watch_history').select('title_id,progress_seconds,updated_at').eq('user_id',user.id).eq('completed',false).gt('progress_seconds',0).order('updated_at',{ascending:false});setItems((data||[]).map(x=>({...x,title:titles.find(t=>t.id===x.title_id)})).filter(x=>x.title));setLoading(false)})()},[])
 const clear=async(id:string)=>{if(!supabase)return;const {data:{user}}=await supabase.auth.getUser();if(!user)return;await supabase.from('watch_history').delete().eq('user_id',user.id).eq('title_id',id);setItems(x=>x.filter(v=>v.title_id!==id))}
 return <main className="shell"><nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a><div className="navlinks"><a href="/movies">Movies</a><a href="/series">Series</a><a href="/my-list">My List</a><a href="/search">Search</a></div><div className="actions"><a className="btn" href="/">Home</a></div></nav><section className="section" style={{paddingTop:70}}><div className="eyebrow">KEEP WATCHING</div><h1>Continue Watching</h1><p className="muted" style={{maxWidth:650}}>Pick up exactly where you left off.</p>{loading?<div className="panel" style={{marginTop:30}}><p className="muted">Loading your progress…</p></div>:!user?<div className="panel" style={{marginTop:30}}><h3>Sign in to keep your place.</h3><p className="muted">Your progress will follow you across devices.</p><a className="btn primary" href="/login?next=%2Fcontinue-watching" style={{display:'inline-block',marginTop:12}}>Sign in</a></div>:!items.length?<div className="panel" style={{marginTop:30}}><h3>Nothing waiting for you.</h3><p className="muted">Start a movie and your progress will appear here.</p><a className="btn primary" href="/movies" style={{display:'inline-block',marginTop:12}}>Browse movies</a></div>:<div className="grid" style={{marginTop:30}}>{items.map(x=>{const pct=Math.min(100,Math.round((x.progress_seconds/3600)*100));const m=Math.floor(x.progress_seconds/60),s=x.progress_seconds%60;return <article className="card" key={x.title_id}><div className="tag">{x.title.genre}</div><h3>{x.title.title}</h3><p className="muted">{x.title.year} · {m}:{String(s).padStart(2,'0')} watched</p><div style={{height:4,background:'rgba(255,255,255,.1)',borderRadius:9,marginTop:14,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.max(4,pct)}%`,background:'linear-gradient(90deg,#7c3aed,#60a5fa)'}}/></div><div style={{display:'flex',gap:8,marginTop:14,flexWrap:'wrap'}}><a className="btn primary" href={`/watch/${x.title_id}`}>Resume</a><button className="btn" onClick={()=>clear(x.title_id)}>Remove</button></div></article>})}</div>}</section><footer className="footer">© 2026 BREAKTHROUGH. Stories worth staying up for.</footer></main>
}
