'use client'

import {useEffect,useRef,useState} from 'react'

export default function WatchPlayer({titleId,video,type}:{titleId:string;video:string;type:string}){
 const ref=useRef<HTMLVideoElement>(null)
 const pendingProgress=useRef<number|null>(null)
 const [progress,setProgress]=useState(0)
 const [duration,setDuration]=useState(0)
 const [signedIn,setSignedIn]=useState(false)
 const lastSaved=useRef(0)

 useEffect(()=>{
  let cancelled=false
  pendingProgress.current=null
  setProgress(0)
  setDuration(0)
  setSignedIn(false)
  lastSaved.current=0
  ;(async()=>{
   try{
    const r=await fetch(`/api/watch-progress?titleId=${encodeURIComponent(titleId)}`)
    if(!r.ok||cancelled)return
    const d=await r.json()
    setSignedIn(true)
    const saved=Number(d.progressSeconds)||0
    if(saved>0)pendingProgress.current=saved
    if(Number(d.durationSeconds)>0)setDuration(Number(d.durationSeconds))
   }catch{}
  })()
  return()=>{cancelled=true}
 },[titleId])

 const restoreProgress=(v:HTMLVideoElement)=>{
  const saved=pendingProgress.current
  if(saved===null||!Number.isFinite(v.duration)||v.duration<=0)return
  const safe=Math.min(saved,Math.max(0,v.duration-1))
  if(safe>0){v.currentTime=safe;setProgress(safe);lastSaved.current=safe}
  pendingProgress.current=null
 }

 const save=async()=>{
  const v=ref.current
  if(!v||!Number.isFinite(v.duration)||v.duration<=0)return
  try{
   const r=await fetch('/api/watch-progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titleId,progressSeconds:v.currentTime,durationSeconds:v.duration})})
   if(r.ok)setSignedIn(true)
  }catch{}
 }

 return <div><div style={{background:'#000',borderRadius:16,overflow:'hidden',boxShadow:'0 25px 70px rgba(0,0,0,.45)'}}><video ref={ref} controls playsInline preload="metadata" src={video} onLoadedMetadata={e=>{setDuration(e.currentTarget.duration);restoreProgress(e.currentTarget)}} onDurationChange={e=>{if(e.currentTarget.duration>0){setDuration(e.currentTarget.duration);restoreProgress(e.currentTarget)}}} onTimeUpdate={e=>{setProgress(e.currentTarget.currentTime);if(e.currentTarget.currentTime-lastSaved.current>15){lastSaved.current=e.currentTarget.currentTime;void save()}}} onPause={()=>void save()} onEnded={()=>void save()} style={{width:'100%',display:'block',maxHeight:'72vh'}}><source src={video} type={type}/></video></div>{duration>0&&<div style={{marginTop:10,height:3,borderRadius:99,background:'rgba(255,255,255,.12)',overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,(progress/duration)*100)}%`,background:'linear-gradient(90deg,#7c3aed,#8b5cf6)'}}/></div>}{signedIn&&progress>0&&<p className="muted" style={{fontSize:13,marginTop:8}}>Your progress is saved to your account.</p>}</div>
}
