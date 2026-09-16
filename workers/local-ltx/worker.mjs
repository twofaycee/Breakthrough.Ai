import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {mkdir} from 'node:fs/promises'
import path from 'node:path'

const execFileAsync=promisify(execFile)
const base=process.env.BREAKTHROUGH_SUPABASE_URL
const key=process.env.BREAKTHROUGH_SUPABASE_SERVICE_ROLE_KEY
const outputDir=process.env.BREAKTHROUGH_OUTPUT_DIR||path.resolve('breakthrough-output')
const pollMs=Number(process.env.BREAKTHROUGH_POLL_MS||5000)

if(!base||!key) throw new Error('BREAKTHROUGH_SUPABASE_URL and BREAKTHROUGH_SUPABASE_SERVICE_ROLE_KEY are required')

const headers={apikey:key,Authorization:`Bearer ${key}`, 'Content-Type':'application/json'}

async function api(pathname,options={}){
  const response=await fetch(`${base}/rest/v1/${pathname}`,{...options,headers:{...headers,...(options.headers||{})}})
  const text=await response.text()
  if(!response.ok) throw new Error(`Supabase ${response.status}: ${text}`)
  return text?JSON.parse(text):null
}

async function claimScene(){
  const rows=await api('production_scenes?select=id,plan_id,scene_number,title,prompt,duration_seconds,production_plans(title_id)&status=eq.queued&order=created_at.asc&limit=1')
  const scene=rows?.[0]
  if(!scene) return null
  const updated=await api(`production_scenes?id=eq.${scene.id}&status=eq.queued`,{method:'PATCH',body:JSON.stringify({status:'running',progress:5,provider:'local-ltx'})})
  void updated
  return scene
}

async function completeScene(scene,videoPath){
  await api(`production_scenes?id=eq.${scene.id}`,{method:'PATCH',body:JSON.stringify({status:'completed',progress:100,provider:'local-ltx',video_path:videoPath,video_url:null,error_message:null})})
}

async function failScene(scene,error){
  await api(`production_scenes?id=eq.${scene.id}`,{method:'PATCH',body:JSON.stringify({status:'failed',progress:0,provider:'local-ltx',error_message:String(error).slice(0,4000)})})
}

async function generate(scene){
  await mkdir(outputDir,{recursive:true})
  const safeTitle=String(scene.title||`scene-${scene.scene_number}`).replace(/[^a-z0-9-_]+/gi,'-').toLowerCase()
  const output=path.join(outputDir,`${scene.plan_id}-scene-${scene.scene_number}-${safeTitle}.mp4`)
  const args=[
    'workers/local-ltx/generate_scene.py',
    '--prompt',scene.prompt,
    '--output',output,
    '--duration',String(scene.duration_seconds||8)
  ]
  const {stdout,stderr}=await execFileAsync(process.env.LTX_PYTHON||'python',args,{cwd:process.cwd(),maxBuffer:1024*1024})
  if(stderr) console.log(stderr)
  console.log(stdout)
  return output
}

async function tick(){
  const scene=await claimScene()
  if(!scene) return false
  console.log(`Generating ${scene.plan_id} scene ${scene.scene_number}: ${scene.title}`)
  try{
    const output=await generate(scene)
    await completeScene(scene,output)
    console.log(`Completed ${output}`)
  }catch(error){
    console.error(error)
    await failScene(scene,error)
  }
  return true
}

console.log('BREAKTHROUGH local LTX worker online')
while(true){
  try{await tick()}catch(error){console.error(error)}
  await new Promise(resolve=>setTimeout(resolve,pollMs))
}
