import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
	const { userId } = await auth()
	if (!userId) return NextResponse.json({ count: 0 })

	const buyer = await db.buyer.findUnique({
		where: { clerk_user_id: userId },
		select: { id_buyer: true },
	})

	if (!buyer) return NextResponse.json({ count: 0 })

	const result = await db.cartItem.aggregate({
		where: { cart: { id_buyer: buyer.id_buyer } },
		_sum: { quantity: true },
	})

	return NextResponse.json({ count: result._sum.quantity ?? 0 })
}
