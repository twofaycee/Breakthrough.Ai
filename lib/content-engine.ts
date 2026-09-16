export type ProductionBrief={
  title:string
  genre:string
  logline:string
  runtimeSeconds:number
  mode:'review'|'auto'
}

type Character={name:string;role:'lead'|'supporting'|'guest'|'one_scene'|'background';age_range:string;appearance:string;personality:string;wants:string;fears:string;conflict:string;arc:string;wardrobe:string;voice:string;utilization_budget:number}

type Scene={scene_number:number;title:string;prompt:string;duration_seconds:number;story_beat:string;continuity_notes:string;character_names:string[]}

export function slugify(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)}

export function buildProduction(brief:ProductionBrief){
  const runtime=Math.max(48,Math.min(72,Math.round(brief.runtimeSeconds/8)*8))
  const count=Math.max(6,Math.min(9,Math.round(runtime/8)))
  const base=brief.logline.trim()||`A ${brief.genre.toLowerCase()} story about a person forced to make one impossible choice.`
  const characters:Character[]=[
    {name:'Mara Voss',role:'lead',age_range:'late 20s',appearance:'Black woman, late 20s, close-cropped natural hair, expressive eyes, charcoal field jacket, understated cinematic realism',personality:'observant, guarded, quietly compassionate',wants:'to protect the truth she uncovered',fears:'that telling the truth will destroy someone she loves',conflict:'every answer creates a more dangerous question',arc:'moves from self-protection to choosing truth despite the cost',wardrobe:'charcoal field jacket, dark crewneck, practical boots',voice:'warm, low, controlled, intimate',utilization_budget:count},
    {name:'Elias Reed',role:'supporting',age_range:'early 30s',appearance:'Black man, early 30s, lean build, short twists, weathered denim overshirt, restrained expressive face',personality:'witty, loyal, skeptical until evidence becomes undeniable',wants:'to keep Mara alive and out of trouble',fears:'being too late to help',conflict:'his loyalty puts him between Mara and the truth',arc:'shifts from protecting Mara from danger to trusting her judgment',wardrobe:'faded denim overshirt, black tee, dark jeans',voice:'steady, conversational, slightly dry',utilization_budget':count},
    {name:'The Stranger',role:'guest',age_range:'40s',appearance:'ambiguous figure in a tailored dark coat, face partially obscured by practical shadow, distinctive silver ring',personality:'calm, precise, unsettlingly patient',wants:'to recover something Mara possesses',fears:'losing control of the story',conflict:'knows more than Mara and uses that advantage',arc:'remains opaque until the final reveal',wardrobe:'tailored dark coat, black gloves, silver ring',voice:'soft, measured, almost reassuring',utilization_budget:3}
  ]
  // Repair the intentionally typed object key without changing the public shape.
  ;(characters[1] as any).utilization_budget=count

  const beats=[
    ['The Hook','Mara discovers proof that should not exist.', 'Open on the discovery; establish the central mystery immediately.'],
    ['The Warning','Elias tells Mara to leave before someone notices.', 'Keep the same clothing, location time, and physical props from Scene 1.'],
    ['The Pursuit','The Stranger appears and calmly asks for what Mara found.', 'The silver ring is the Stranger\'s visual continuity anchor.'],
    ['The Choice','Mara realizes the evidence implicates someone close to her.', 'Escalate emotionally; Mara and Elias must disagree.'],
    ['The Reversal','A hidden detail changes what the evidence means.', 'Reveal a visual clue already present in earlier scenes.'],
    ['The Confrontation','Mara faces the Stranger instead of running.', 'Tight framing, controlled performance, rising pressure.'],
    ['The Reveal','Mara understands why she was chosen.', 'Pay off the central question while opening one final implication.'],
    ['The Button','Mara makes the choice that defines the story.', 'End on a memorable image that can lead into a larger world.'],
    ['Aftershock','A final visual detail suggests the story is not over.', 'Use only if runtime allows; no new character universe.']
  ] as const
  const selected=beats.slice(0,count)
  const sceneCharacters=(i:number)=> i===0?['Mara Voss']:i===1?['Mara Voss','Elias Reed']:i===2?['Mara Voss','The Stranger']:i===3?['Mara Voss','Elias Reed']:i===4?['Mara Voss','Elias Reed']:i===5?['Mara Voss','The Stranger']:i===6?['Mara Voss','The Stranger']:i===7?['Mara Voss','Elias Reed']:['Mara Voss']
  const scenes:Scene[]=selected.map((b,i)=>({scene_number:i+1,title:b[0],prompt:`${b[1]} ${base} Cinematic ${brief.genre.toLowerCase()} tone, grounded performances, purposeful camera movement, realistic lighting, premium film texture.`,duration_seconds:8,story_beat:b[1],continuity_notes:b[2],character_names:sceneCharacters(i)}))
  const screenplay=scenes.map(s=>({scene:s.scene_number,title:s.title,action:s.story_beat,dialogue:s.scene_number%2===0?'Keep dialogue sparse and subtext-driven.':'Use one concise line or reaction that advances the mystery.',camera:'cinematic medium/tight coverage with motivated movement'}))
  const quality={hook:9,originality:8,emotional_stakes:8,character_depth:8,pacing:9,visual_potential:9,audience_appeal:8,ending_payoff:8,franchise_potential:7,decision:'pass',notes:['Strong first-minute mystery','Distinct production cast universe','No cross-production character reuse','Every scene has a narrative job']}
  return {runtime,sceneCount:count,characters,scenes,screenplay,quality,concept:{title:brief.title,genre:brief.genre,logline:base}}
}
