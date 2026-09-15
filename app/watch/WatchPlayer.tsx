'use client'

import {useEffect,useRef,useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function WatchPlayer({titleId,video,type}:{titleId:string;video:string;type:string}){
 const ref=useRef<HTMLVideoElement>(null)
 const [userId,setUserId]=useState<string|null>(null)
 const [saved,setSaved]=useState(false)
 const [progress,setProgress]=useState(0)
 const lastSave=useRef(0)
 useEffect(()=>{let active=true;(async()=>{if(!supabase)return;const {data:{user}}=await supabase.auth.getUser();if(!active)return;setUserId(user?.id??null);if(!user)return;const [{data:wl},{data:hist}]=await Promise.all([supabase.from('watchlist').select('title_id').eq('user_id',user.id).eq('title_id',titleId).maybeSingle(),supabase.from('watch_history').select('progress_seconds,completed').eq('user_id',user.id).eq('title_id',titleId).maybeSingle()]);setSaved(!!wl);if(hist&&!hist.completed)setProgress(hist.progress_seconds||0)})();return()=>{active=false}},[titleId])
 useEffect(()=>{const v=ref.current;if(!v||!progress)return;const restore=()=>{try{if(progress>5&&progress<v.duration-10)v.currentTime=progress}catch{}};v.addEventListener('loadedmetadata',restore);return()=>v.removeEventListener('loadedmetadata',restore)},[progress])
 const persist=async()=>{const v=ref.current;if(!supabase||!userId||!v||!Number.isFinite(v.currentTime))return;const seconds=Math.floor(v.currentTime);if(seconds<1||seconds===lastSave.current)return;lastSave.current=seconds;await supabase.from('watch_history').upsert({user_id:userId,title_id:titleId,progress_seconds:seconds,completed:Number.isFinite(v.duration)&&v.duration>0&&v.currentTime/v.duration>=.92,updated_at:new Date().toISOString()},{onConflict:'user_id,title_id'})}
 const toggle=async()=>{if(!supabase||!userId){window.location.href='/login?next=%2Fwatch%2F'+titleId;return}if(saved){await supabase.from('watchlist').delete().eq('user_id',userId).eq('title_id',titleId);setSaved(false)}else{const {error}=await supabase.from('watchlist').insert({user_id:userId,title_id:titleId});if(!error)setSaved(true)}}
 return <><div style={{background:'#020308',border:'1px solid rgba(255,255,255,.1)',borderRadius:18,overflow:'hidden',boxShadow:'0 30px 90px rgba(0,0,0,.45)'}}><video ref={ref} controls playsInline preload="metadata" onTimeUpdate={()=>{const v=ref.current;if(v&&v.currentTime-lastSave.current>=10)persist()}} onPause={persist} onEnded={persist} style={{display:'block',width:'100%',aspectRatio:'16/9',background:'#000'}}><source src={video} type={type}/>Your browser does not support this video.</video></div><div style={{display:'flex',gap:10,marginTop:14,flexWrap:'wrap'}}><button className="btn" onClick={toggle}>{saved?'✓ In My List':'+ My List'}</button>{userId&&progress>5?<button className="btn" onClick={()=>{if(ref.current)ref.current.currentTime=progress}}>Resume from {Math.floor(progress/60)}:{String(Math.floor(progress%60)).padStart(2,'0')}</button>:null}</div></>
}
