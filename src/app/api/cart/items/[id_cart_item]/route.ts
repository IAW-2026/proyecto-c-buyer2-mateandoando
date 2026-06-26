import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id_cart_item: string }> }
) {
    const { userId } = await auth()

    if (!userId)
        return new Response('Unauthorized', { status: 401 })

    const body = await request.json()
    const { quantity } = body

    if (!quantity)
        return new Response('Missing required field: quantity', { status: 400 })

    const buyer = await db.buyer.findUnique({
        where: { clerk_user_id: userId }
    })

    if (!buyer)
        return new Response('Buyer not found', { status: 404 })

    const { id_cart_item } = await params

    const cartItem = await db.cartItem.findFirst({
        where: {
            id_cart_item,
            cart: { id_buyer: buyer.id_buyer } },
    })

    if (!cartItem)
        return new Response('Cart item not found', { status: 404 })

    const updated = await db.cartItem.update({
        where: { id_cart_item },
        data: { quantity },
    })

    return Response.json(updated)
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id_cart_item: string }> }
) {
    const { userId } = await auth()

    if (!userId)
        return new Response('Unauthorized', { status: 401 })

    const buyer = await db.buyer.findUnique({
        where: { clerk_user_id: userId }
    })

    if (!buyer)
        return new Response('Buyer not found', { status: 404 })

    const { id_cart_item } = await params

    const cartItem = await db.cartItem.findFirst({
        where: {
            id_cart_item,
            cart: { id_buyer: buyer.id_buyer }
        }
    })

    if (!cartItem)
        return new Response('Cart item not found', { status: 404 })

    await db.cartItem.delete({
        where: { id_cart_item }
    })

    return Response.json({ deleted: true })
}