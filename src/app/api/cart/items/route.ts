import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()
  const { id_item, quantity } = body

  if (!id_item || !quantity) {
    const missingFields = []

    if (!id_item) 
      missingFields.push('id_item')
    if (!quantity)
      missingFields.push('quantity')

    return new Response(
      'Missing required fields: ' + missingFields.join(', '), { status: 400 }
    )
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
  })

  const cartItem = await db.cartItem.create({
    data: { id_cart: cart.id_cart, id_item, quantity },
  })

  return Response.json(cartItem)
}