'use client'

import {useEffect,useRef,useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function WatchPlayer({titleId,video,type}:{titleId:string;video:string;type:string}){
 const ref=useRef<HTMLVideoElement>(null)
 const [progress,setProgress]=useState(0)
 const [duration,setDuration]=useState(0)
 const [userId,setUserId]=useState<string|null>(null)
 const lastSaved=useRef(0)
 useEffect(()=>{let active=true;(async()=>{if(!supabase)return;const {data:{user}}=await supabase.auth.getUser();if(!active)return;setUserId(user?.id??null);if(!user)return;const {data}=await supabase.from('watch_history').select('progress_seconds,duration_seconds').eq('user_id',user.id).eq('title_id',titleId).maybeSingle();if(active&&data?.progress_seconds&&ref.current){ref.current.currentTime=Number(data.progress_seconds);setProgress(Number(data.progress_seconds));if(data.duration_seconds)setDuration(Number(data.duration_seconds))}})();return()=>{active=false}},[titleId])
 const save=async()=>{const v=ref.current;if(!v||!userId||v.duration<=0)return;await supabase?.from('watch_history').upsert({user_id:userId,title_id:titleId,progress_seconds:Math.floor(v.currentTime),duration_seconds:Math.floor(v.duration),updated_at:new Date().toISOString()},{onConflict:'user_id,title_id'})}
 return <div><div style={{background:'#000',borderRadius:16,overflow:'hidden',boxShadow:'0 25px 70px rgba(0,0,0,.45)'}}><video ref={ref} controls playsInline preload="metadata" src={video} onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onTimeUpdate={e=>{setProgress(e.currentTarget.currentTime);if(e.currentTarget.currentTime-lastSaved.current>15){lastSaved.current=e.currentTarget.currentTime;void save()}}} onPause={()=>void save()} onEnded={()=>void save()} style={{width:'100%',display:'block',maxHeight:'72vh'}}><source src={video} type={type}/></video></div>{duration>0&&<div style={{marginTop:10,height:3,borderRadius:99,background:'rgba(255,255,255,.12)',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,(progress/duration)*100)}%`,background:'linear-gradient(90deg,#7c3aed,#8b5cf6)'}}/></div>}{userId&&progress>0&&duration>progress+5&&<p className="muted" style={{fontSize:13,marginTop:8}}>Resume position saved · {Math.floor((progress/duration)*100)}% watched</p>}</div>
}
