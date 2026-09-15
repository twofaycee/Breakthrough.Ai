const films = {
  'the-general': {
    title: 'The General',
    year: '1926',
    genre: 'Comedy · War · Romance',
    description: 'Buster Keaton’s silent-action classic follows engineer Johnnie Gray as he races across enemy lines to rescue his beloved Annabelle and his locomotive.',
    video: 'https://archive.org/download/TheGeneral1926/The_General_1926_720p.mp4',
    type: 'video/mp4',
    source: 'Internet Archive / Public Domain'
  },
  'his-girl-friday': {
    title: 'His Girl Friday',
    year: '1940',
    genre: 'Comedy · Romance · Crime',
    description: 'A fast-talking newspaper editor tries to keep his star reporter—and estranged wife—from leaving the newsroom for good.',
    video: 'https://upload.wikimedia.org/wikipedia/commons/8/81/His_Girl_Friday_%281940%29.ogv',
    type: 'video/ogg',
    source: 'Wikimedia Commons / Public Domain'
  },
  'night-of-the-living-dead': {
    title: 'Night of the Living Dead',
    year: '1968',
    genre: 'Horror · Zombie',
    description: 'Seven strangers barricade themselves inside a rural farmhouse while the recently dead rise outside and the survivors turn on each other.',
    video: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Night_of_the_Living_Dead_%281968_film%29.webm',
    type: 'video/webm',
    source: 'Wikimedia Commons / Public Domain'
  }
} as const

export default async function Watch({params}:{params:Promise<{id:string}>}){
  const {id}=await params
  const film=films[id as keyof typeof films]
  if(!film) return <main className="shell"><nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a></nav><section className="section"><h1>Title not found</h1><a className="btn primary" href="/movies">Back to movies</a></section></main>
  return <main className="shell"><nav className="nav"><a className="brand" href="/">BREAKTHROUGH</a><div className="actions"><a className="btn" href="/movies">Movies</a><a className="btn" href="/">Home</a></div></nav><section className="section" style={{paddingTop:28}}><div style={{maxWidth:1100,margin:'0 auto'}}><div style={{background:'#020308',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,overflow:'hidden',boxShadow:'0 30px 90px rgba(0,0,0,.45)'}}><video controls playsInline preload="metadata" style={{display:'block',width:'100%',aspectRatio:'16/9',background:'#000'}}><source src={film.video} type={film.type}/>Your browser does not support this video.</video></div><div style={{padding:'28px 4px'}}><div className="eyebrow">BREAKTHROUGH CLASSICS · {film.source}</div><h1 style={{marginBottom:8}}>{film.title}</h1><div className="muted" style={{marginBottom:18}}>{film.year} · {film.genre}</div><p className="muted" style={{maxWidth:760,lineHeight:1.7}}>{film.description}</p><div style={{marginTop:22}}><a className="btn" href="/movies">← Back to catalog</a></div></div></div></section></main>
}
