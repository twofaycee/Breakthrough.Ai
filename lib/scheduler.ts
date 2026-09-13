
export function featuredScore(f:any){
  const ageDays = (Date.now() - new Date(f.created_at || Date.now()).getTime())/(1000*60*60*24)
  return ((f.views||0)*0.5 + (f.likes||0)*10 + (f.match||80)*2) / (1 + ageDays*0.05)
}
export function shouldRemove(f:any){
  const ageDays = (Date.now() - new Date(f.created_at || Date.now()).getTime())/(1000*60*60*24)
  if(ageDays < 14) return false
  if((f.featured_score||0) > 500) return false
  return (f.views||0) < 50
}
