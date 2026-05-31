import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id_buyer: string }> },
) {
	const { sessionClaims } = await auth()
	const role = (sessionClaims?.publicMetadata as { role?: string })?.role

	if (role !== 'admin-buyer') {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	const { id_buyer } = await params
	const body = await req.json()
	const { status } = body

	if (status !== 'ACTIVO' && status !== 'SUSPENDIDO') {
		return NextResponse.json({ error: 'status must be ACTIVO or SUSPENDIDO' }, { status: 400 })
	}

	const buyer = await db.buyer.findUnique({ where: { id_buyer } })

	if (!buyer) {
		return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })
	}

	const updated = await db.buyer.update({
		where: { id_buyer },
		data: { status },
		select: {
			id_buyer: true,
			status: true,
		},
	})

	return NextResponse.json(updated)
}
