import {NextResponse} from 'next/server'
import {supabaseServer} from '@/lib-supabase-server'
import {buildProduction,slugify} from '@/lib/content-engine'

export const dynamic='force-dynamic'

async function adminClient(){
  const supabase=await supabaseServer()
  const {data:{user}}=await supabase.auth.getUser()
  if(!user) return {supabase,user:null,allowed:false}
  const {data:profile}=await supabase.from('profiles').select('is_admin').eq('id',user.id).maybeSingle()
  return {supabase,user,allowed:profile?.is_admin===true}
}

export async function POST(req:Request){
  try{
    const {supabase,allowed}=await adminClient()
    if(!allowed) return NextResponse.json({error:'Admin access required'},{status:403})
    const body=await req.json()
    const seed=Date.now()
    const brief={
      title:String(body.title||'Untitled Production').trim().slice(0,120),
      genre:String(body.genre||'Thriller').trim().slice(0,80),
      logline:String(body.logline||'').trim().slice(0,1000),
      runtimeSeconds:Number(body.runtimeSeconds)||64,
      mode:body.mode==='auto'?'auto':'review',
      seed
    } as const
    if(brief.title.length<2) return NextResponse.json({error:'Title is required'},{status:400})

    const engine=buildProduction(brief)
    const slug=`${slugify(brief.title)||'production'}-${seed.toString(36)}`

    const {data:title,error:titleError}=await supabase.from('titles').insert({
      title:brief.title,
      slug,
      description:brief.logline,
      type:'movie',
      status:'draft',
      runtime_seconds:engine.runtime
    }).select('id,title,slug').single()
    if(titleError) throw titleError

    const genreNames=brief.genre.split(',').map((value:string)=>value.trim()).filter(Boolean)
    if(genreNames.length){
      const {data:genres}=await supabase.from('genres').select('id,name').in('name',genreNames)
      if(genres?.length){
        const {error:genreError}=await supabase.from('title_genres').insert(genres.map((genre:{id:string})=>({title_id:title.id,genre_id:genre.id})))
        if(genreError) throw genreError
      }
    }

    const {data:plan,error:planError}=await supabase.from('production_plans').insert({
      title_id:title.id,
      story:brief.logline,
      character_bible:engine.characters,
      scene_count:engine.sceneCount,
      target_runtime_seconds:engine.runtime,
      mode:brief.mode,
      continuity_bible:{
        cast_universe_rule:'Characters belong only to this production.',
        visual_style:'cinematic realism',
        global_notes:['Do not reuse characters from another production.','Preserve wardrobe, physical traits, props, and geography across scenes.']
      }
    }).select('id,cast_universe_id').single()
    if(planError) throw planError

    const {data:artifact,error:artifactError}=await supabase.from('creative_artifacts').insert({
      plan_id:plan.id,
      title_id:title.id,
      brief:{...brief,runtimeSeconds:engine.runtime},
      concept_candidates:[engine.concept],
      selected_concept:engine.concept,
      screenplay:engine.screenplay,
      quality_report:engine.quality,
      status:brief.mode==='auto'?'approved':'draft'
    }).select('id').single()
    if(artifactError) throw artifactError

    const castRows=engine.characters.map(character=>({
      plan_id:plan.id,
      cast_universe_id:plan.cast_universe_id,
      production_id:plan.id,
      name:character.name,
      role:character.role,
      age_range:character.age_range,
      appearance:character.appearance,
      personality:character.personality,
      wants:character.wants,
      fears:character.fears,
      conflict:character.conflict,
      arc:character.arc,
      wardrobe:character.wardrobe,
      voice:character.voice,
      utilization_budget:character.utilization_budget,
      status:'queued'
    }))
    const {data:characters,error:characterError}=await supabase.from('production_characters').insert(castRows).select('id,name,role')
    if(characterError) throw characterError
    const byName=new Map((characters||[]).map(c=>[c.name,c.id]))

    const sceneRows=engine.scenes.map(scene=>({
      plan_id:plan.id,
      scene_number:scene.scene_number,
      title:scene.title,
      prompt:scene.prompt,
      duration_seconds:scene.duration_seconds,
      status:'queued',
      progress:0,
      provider:'local-ltx',
      required_characters:scene.character_names,
      character_ids:scene.character_names.map(name=>byName.get(name)).filter(Boolean),
      story_beat:scene.story_beat,
      continuity_notes:scene.continuity_notes,
      continuity_prompt:`Production cast universe ${plan.cast_universe_id}. Only use these scene characters: ${scene.character_names.join(', ')}. Preserve identity and wardrobe.`
    }))
    const {data:scenes,error:sceneError}=await supabase.from('production_scenes').insert(sceneRows).select('id,scene_number')
    if(sceneError) throw sceneError

    const {error:assemblyError}=await supabase.from('production_assemblies').insert({
      plan_id:plan.id,
      title_id:title.id,
      status:'queued',
      progress:0,
      provider:'local-ffmpeg'
    })
    if(assemblyError) throw assemblyError

    const {error:jobError}=await supabase.from('generation_jobs').insert({
      title_id:title.id,
      status:'queued',
      stage:'story',
      progress:100,
      provider:'breakthrough-content-engine'
    })
    if(jobError) throw jobError

    return NextResponse.json({
      ok:true,
      title,
      planId:plan.id,
      artifactId:artifact.id,
      sceneCount:engine.sceneCount,
      castCount:engine.characters.length,
      sceneIds:(scenes||[]).map(scene=>scene.id),
      castUniverseId:plan.cast_universe_id,
      quality:engine.quality,
      nextStage:brief.mode==='auto'?'character-references':'review'
    })
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:'Content engine failed'},{status:500})
  }
}
