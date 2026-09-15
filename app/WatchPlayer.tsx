'use client'

import {useEffect,useRef,useState} from 'react'

export default function WatchPlayer({titleId,video,type}:{titleId:string;video:string;type:string}){
 const ref=useRef<HTMLVideoElement>(null);const [progress,setProgress]=useState(0);const [duration,setDuration]=useState(0);const [signedIn,setSignedIn]=useState(false);const lastSaved=useRef(0)
 useEffect(()=>{(async()=>{try{const r=await fetch(`/api/watch-progress?titleId=${encodeURIComponent(titleId)}`);if(r.ok){const d=await r.json();setSignedIn(true);if(d.progressSeconds&&ref.current){ref.current.currentTime=Number(d.progressSeconds);setProgress(Number(d.progressSeconds))}if(d.durationSeconds)setDuration(Number(d.durationSeconds))}}catch{}})()},[titleId])
 const save=async()=>{const v=ref.current;if(!v||v.duration<=0)return;try{const r=await fetch('/api/watch-progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titleId,progressSeconds:v.currentTime,durationSeconds:v.duration})});if(r.ok)setSignedIn(true)}catch{}}
 return <div><div style={{background:'#000',borderRadius:16,overflow:'hidden',boxShadow:'0 25px 70px rgba(0,0,0,.45)'}}><video ref={ref} controls playsInline preload="metadata" src={video} onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onTimeUpdate={e=>{setProgress(e.currentTarget.currentTime);if(e.currentTarget.currentTime-lastSaved.current>15){lastSaved.current=e.currentTarget.currentTime;void save()}}} onPause={()=>void save()} onEnded={()=>void save()} style={{width:'100%',display:'block',maxHeight:'72vh'}}><source src={video} type={type}/></video></div>{duration>0&&<div style={{marginTop:10,height:3,borderRadius:99,background:'rgba(255,255,255,.12)',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,(progress/duration)*100)}%`,background:'linear-gradient(90deg,#7c3aed,#8b5cf6)'}}/></div>}{signedIn&&progress>0&&<p className="muted" style={{fontSize:13,marginTop:8}}>Your progress is saved to your account.</p>}</div>
}
