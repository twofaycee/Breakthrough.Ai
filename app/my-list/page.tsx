'use client'

import {useEffect,useMemo,useState} from 'react'

const titles=[
 {id:'the-general',title:'The General',year:'1926',genre:'Comedy · War · Romance',desc:'Buster Keaton races across enemy lines to rescue his beloved and his locomotive.'},
 {id:'his-girl-friday',title:'His Girl Friday',year:'1940',genre:'Comedy · Romance · Crime',desc:'A legendary reporter tries to leave the newsroom while her editor fights to keep her on the biggest story in town.'},
 {id:'night-of-the-living-dead',title:'Night of the Living Dead',year:'1968',genre:'Horror · Zombie',desc:'Seven strangers barricade themselves in a farmhouse as the dead rise outside.'},
 {id:'detour',title:'Detour',year:'1945',genre:'Film Noir · Crime · Thriller',desc:'A hitchhiking pianist takes a stranger’s identity and finds himself trapped in a nightmare.'},
 {id:'the-stranger',title:'The Stranger',year:'1946',genre:'Film Noir · Mystery · Thriller',desc:'A war-crimes investigator follows a hidden Nazi fugitive into a quiet Connecticut town.'},
 {id:'charade',title:'Charade',year:'1963',genre:'Mystery · Romance · Comedy',desc:'A widow in Paris is pursued by strangers who all seem to know more about her husband than she does.'}
]

export default function MyList(){
 const [saved,setSaved]=useState<string[]>([])
 useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem('breakthrough_my_list')||'[]'))}catch{setSaved([])}},[])
 const items=useMemo(()=>titles.filter(t=>saved.includes(t.id)),[saved])
 const remove=(id:string)=>{const next=saved.filter(x=>x!==id);setSaved(next);localStorage.setItem('breakthrough_my_list',JSON.stringify(next))}
 return <main className="shell"><nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a><div className="navlinks"><a href="/movies">Movies</a><a href="/series">Series</a><a href="/search">Search</a><a href="/pricing">Pricing</a></div><div className="actions"><a className="btn" href="/">Home</a></div></nav>
 <section className="section" style={{paddingTop:70}}><div className="eyebrow">YOUR LIBRARY</div><h1>My List</h1><p className="muted" style={{maxWidth:650}}>Keep the titles you want to come back to in one place.</p>
 {!items.length?<div className="panel" style={{marginTop:30}}><h3>Your list is empty.</h3><p className="muted">Browse the catalog and add titles you want to watch later.</p><a className="btn primary" href="/movies" style={{display:'inline-block',marginTop:12}}>Browse movies</a></div>:<div className="grid" style={{marginTop:30}}>{items.map(t=><article className="card" key={t.id}><div><div className="tag">{t.genre}</div><h3>{t.title}</h3><p className="muted">{t.year} · {t.desc}</p><div style={{display:'flex',gap:8,marginTop:14,flexWrap:'wrap'}}><a className="btn primary" href={`/watch/${t.id}`}>Watch now</a><button className="btn" onClick={()=>remove(t.id)}>Remove</button></div></div></article>)}</div>}
 </section><footer className="footer">© 2026 BREAKTHROUGH. Stories worth staying up for.</footer></main>
}
