'use client'

import {useMemo, useState} from 'react'

const films=[
  {id:'the-general',title:'The General',genre:'Comedy · War · Romance',desc:'Buster Keaton races across enemy lines to rescue his beloved and his locomotive.'},
  {id:'his-girl-friday',title:'His Girl Friday',genre:'Comedy · Romance · Crime',desc:'A legendary reporter tries to leave the newsroom while her editor fights to keep her on the biggest story in town.'},
  {id:'night-of-the-living-dead',title:'Night of the Living Dead',genre:'Horror · Zombie',desc:'Seven strangers barricade themselves in a farmhouse as the dead rise outside.'},
  {id:'detour',title:'Detour',genre:'Film Noir · Crime · Thriller',desc:'A hitchhiking pianist takes a stranger’s identity and finds himself trapped in a nightmare.'},
  {id:'the-stranger',title:'The Stranger',genre:'Film Noir · Mystery · Thriller',desc:'A war-crimes investigator follows a hidden Nazi fugitive into a quiet Connecticut town.'},
  {id:'charade',title:'Charade',genre:'Mystery · Romance · Comedy',desc:'A widow in Paris is pursued by strangers who all seem to know more about her husband than she does.'},
]

const moods=['All','Comedy','Horror','Thriller','Romance','Crime','Mystery','Film Noir']

export default function SearchPage(){
  const [query,setQuery]=useState('')
  const [mood,setMood]=useState('All')
  const results=useMemo(()=>films.filter(f=>{
    const haystack=`${f.title} ${f.genre} ${f.desc}`.toLowerCase()
    const matchesQuery=!query.trim()||haystack.includes(query.toLowerCase().trim())
    const matchesMood=mood==='All'||f.genre.toLowerCase().includes(mood.toLowerCase())
    return matchesQuery&&matchesMood
  }),[query,mood])

  return <main className="shell">
    <nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a><div className="navlinks"><a href="/movies">Movies</a><a href="/series">Series</a><a href="/search">Search</a><a href="/pricing">Pricing</a></div><div className="actions"><a className="btn" href="/login">Log in</a><a className="btn primary" href="/signup">Start watching</a></div></nav>
    <section className="section" style={{paddingTop:70}}>
      <div className="eyebrow">DISCOVER</div>
      <h1 style={{fontSize:'clamp(42px,6vw,76px)',margin:'8px 0 16px'}}>Find your next watch.</h1>
      <p className="muted" style={{maxWidth:650}}>Search the BREAKTHROUGH catalog by title, genre, or mood.</p>
      <div style={{display:'flex',gap:12,marginTop:28,flexWrap:'wrap'}}>
        <input aria-label="Search movies" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search movies…" style={{flex:'1 1 320px',minHeight:52,borderRadius:12,border:'1px solid rgba(255,255,255,.12)',background:'rgba(255,255,255,.05)',color:'white',padding:'0 16px',fontSize:16,outline:'none'}} />
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:18}}>{moods.map(item=><button key={item} onClick={()=>setMood(item)} className={mood===item?'btn primary':'btn'} style={{cursor:'pointer'}}>{item}</button>)}</div>
    </section>
    <section className="section" style={{paddingTop:10}}>
      <div className="sectionHead"><div><div className="eyebrow">RESULTS</div><h2>{results.length ? `${results.length} titles` : 'Nothing found'}</h2></div></div>
      <div className="grid">{results.map(f=><a href={`/watch/${f.id}`} className="card" key={f.id} style={{minHeight:240}}><div style={{marginTop:'auto'}}><div className="tag">{f.genre}</div><h3>{f.title}</h3><p>{f.desc}</p><span className="btn primary" style={{display:'inline-block',marginTop:8}}>View title</span></div></a>)}</div>
      {!results.length&&<div className="panel"><p className="muted">Try a different title, genre, or mood.</p></div>}
    </section>
    <footer className="footer">© 2026 BREAKTHROUGH. Stories worth staying up for.</footer>
  </main>
}
