'use client'

import {useMemo,useState} from 'react'

const films=[
  {id:'the-general',title:'The General',year:'1926',genre:'Comedy · War · Romance',desc:'Buster Keaton races across enemy lines to rescue his beloved and his locomotive.',image:'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85'},
  {id:'his-girl-friday',title:'His Girl Friday',year:'1940',genre:'Comedy · Romance · Crime',desc:'A legendary reporter tries to leave the newsroom while her editor fights to keep her on the biggest story in town.',image:'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1000&q=85'},
  {id:'night-of-the-living-dead',title:'Night of the Living Dead',year:'1968',genre:'Horror · Zombie',desc:'Seven strangers barricade themselves in a farmhouse as the dead rise outside.',image:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85'},
  {id:'detour',title:'Detour',year:'1945',genre:'Film Noir · Crime · Thriller',desc:'A hitchhiking pianist takes a stranger’s identity and finds himself trapped in a nightmare.',image:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=85'},
  {id:'the-stranger',title:'The Stranger',year:'1946',genre:'Film Noir · Mystery · Thriller',desc:'A war-crimes investigator follows a hidden Nazi fugitive into a quiet Connecticut town.',image:'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=85'},
  {id:'charade',title:'Charade',year:'1963',genre:'Mystery · Romance · Comedy',desc:'A widow in Paris is pursued by strangers who all seem to know more about her husband than she does.',image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=85'},
]
const genres=['All','Comedy','Crime','Film Noir','Horror','Mystery','Romance','Thriller','War','Zombie']

export default function Movies(){
  const [query,setQuery]=useState('')
  const [genre,setGenre]=useState('All')
  const filtered=useMemo(()=>films.filter(f=>{
    const haystack=`${f.title} ${f.genre} ${f.desc}`.toLowerCase()
    return haystack.includes(query.toLowerCase()) && (genre==='All'||f.genre.includes(genre))
  }),[query,genre])
  return <main className="shell">
    <nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a><div className="navlinks"><a href="/">Home</a><a href="/series">Series</a><a href="/search">Search</a><a href="/pricing">Pricing</a></div><div className="actions"><a className="btn primary" href="/pricing">Pro</a></div></nav>
    <section className="section">
      <div className="eyebrow">Watch now</div><h1>Movies</h1><p className="muted" style={{maxWidth:700}}>A handpicked opening collection of classic films available to watch now.</p>
      <div style={{display:'flex',gap:12,marginTop:28,flexWrap:'wrap',alignItems:'center'}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search movies..." aria-label="Search movies" style={{flex:'1 1 280px',minHeight:48,borderRadius:12,border:'1px solid rgba(255,255,255,.12)',background:'rgba(255,255,255,.04)',color:'inherit',padding:'0 16px',outline:'none'}} />
      </div>
      <div style={{display:'flex',gap:8,marginTop:14,flexWrap:'wrap'}} aria-label="Filter by genre">
        {genres.map(g=><button key={g} onClick={()=>setGenre(g)} className={genre===g?'btn primary':'btn'} style={{cursor:'pointer'}}>{g}</button>)}
      </div>
      <div className="sectionHead" style={{marginTop:34}}><div><div className="eyebrow">Your selection</div><h2>{filtered.length} {filtered.length===1?'film':'films'}</h2></div>{(query||genre!=='All')&&<button className="btn" onClick={()=>{setQuery('');setGenre('All')}}>Clear filters</button>}</div>
      {filtered.length?<div className="grid" style={{marginTop:10}}>{filtered.map(f=><a className="card" href={`/watch/${f.id}`} key={f.id} style={{minHeight:360,padding:0,overflow:'hidden',display:'flex',flexDirection:'column',backgroundImage:`linear-gradient(180deg,transparent 20%,rgba(5,7,15,.97) 100%),url(${f.image})`,backgroundSize:'cover',backgroundPosition:'center'}}><div style={{marginTop:'auto',padding:22}}><div className="tag">{f.genre}</div><h3>{f.title}</h3><p className="muted">{f.year} · {f.desc}</p><span className="btn primary" style={{display:'inline-block',marginTop:8}}>Watch now</span></div></a>)}</div>:<div className="panel" style={{marginTop:16}}><h3>No films match that search.</h3><p className="muted">Try another title or choose a different genre.</p><button className="btn" onClick={()=>{setQuery('');setGenre('All')}}>Show all films</button></div>}
    </section>
  </main>
}