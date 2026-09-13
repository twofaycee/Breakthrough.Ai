
export async function analyzeCatalog(films:any[]){
  const byGenre:any={}
  films.forEach(f=>{byGenre[f.genre]=byGenre[f.genre]||{count:0,views:0}; byGenre[f.genre].count++; byGenre[f.genre].views+=f.views||0})
  const weakest = Object.entries(byGenre).sort((a:any,b:any)=>a[1].count-b[1].count)[0]?.[0]||'Drama'
  const hottest = Object.entries(byGenre).sort((a:any,b:any)=>b[1].views-a[1].views)[0]?.[0]||'Thriller'
  return {total:films.length, live:films.filter(f=>['live','featured'].includes(f.status||'live')).length, byGenre, weakestGenre:weakest, hottestGenre:hottest}
}
export async function generateStrategicPlan(analysis:any){
  const weeklyPlan=[
    {day:'Monday',genre:'Drama',slot:'8pm',reason:'Start week emotional hook'},
    {day:'Tuesday',genre:'Thriller',slot:'9pm',reason:'Midweek tension'},
    {day:'Wednesday',genre:analysis.weakestGenre,slot:'8pm',reason:`Fill gap - ${analysis.weakestGenre} underrepresented`},
    {day:'Thursday',genre:'Sci-Fi',slot:'9pm',reason:'Pre-weekend escape'},
    {day:'Friday',genre:analysis.hottestGenre,slot:'10pm',reason:`More of what audience loves - ${analysis.hottestGenre} hottest`},
  ]
  const actions = weeklyPlan.slice(0,3).map(p=>({
    type:'schedule_release',
    reason:p.reason,
    data:{genre:p.genre,prompt:`Breakthrough.ai original: ${p.genre} - ${p.reason} - cinematic 4k - every film was never filmed`,day:p.day,slot:p.slot,releaseAt:new Date(Date.now()+(Math.random()*6+1)*60*60*1000).toISOString()}
  }))
  return {weeklyPlan, actions, analysis}
}
