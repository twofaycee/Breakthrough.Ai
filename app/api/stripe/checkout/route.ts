
import { stripe } from '@/lib/stripe'
export const dynamic='force-dynamic'
export async function POST(){
  if(!stripe) return Response.json({error:'Add STRIPE_SECRET_KEY in Vercel Env Vars - Stripe not connected'},{status:500})
  const priceId=process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
  const appUrl=process.env.NEXT_PUBLIC_APP_URL||'https://breakthrough.ai'
  if(!priceId) return Response.json({error:'Add NEXT_PUBLIC_STRIPE_PRICE_ID - create product in Stripe first'},{status:500})
  try{
    const session=await stripe.checkout.sessions.create({
      mode:'subscription',
      line_items:[{price:priceId,quantity:1}],
      success_url:`${appUrl}/?success=1`,
      cancel_url:`${appUrl}/?canceled=1`
    })
    return Response.json({url:session.url})
  }catch(e:any){ return Response.json({error:e.message},{status:500}) }
}
