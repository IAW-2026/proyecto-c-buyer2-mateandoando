import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const buyer = await db.buyer.findUnique({
    where: { clerk_user_id: userId },
  })

  if (!buyer) {
    return new Response('Buyer not found', { status: 404 })
  }

  const cart = await db.cart.upsert({
    where: { id_buyer: buyer.id_buyer },
    create: { id_buyer: buyer.id_buyer },
    update: {},
    include: { items: true },
  })

  return Response.json(cart)
}
