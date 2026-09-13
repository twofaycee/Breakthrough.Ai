
import { stripe } from '@/lib/stripe'
export const dynamic='force-dynamic'
export async function POST(req:Request){
  const sig=req.headers.get('stripe-signature')
  const secret=process.env.STRIPE_WEBHOOK_SECRET
  if(!stripe||!secret||!sig) return Response.json({received:true, warning:'Add STRIPE_WEBHOOK_SECRET later - not required for build'})
  const body=await req.text()
  try{ const event=stripe.webhooks.constructEvent(body,sig,secret); return Response.json({received:true, type:event.type}) }
  catch(e:any){ return Response.json({error:e.message},{status:400}) }
}
