import { NextRequest, NextResponse } from 'next/server'
import { isServiceTokenValid } from '@/lib/auth/clerk'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest) {
	const token = req.headers.get('X-Service-Token')

	if (!isServiceTokenValid(token ?? undefined, process.env.X_SERVICE_TOKEN_PAYMENTS)) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id_purchase_order, id_payment_operation, status, payment_hash } = await req.json()

	if (!id_purchase_order || !id_payment_operation || !status) {
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
	}

	try {
		const updated = await db.purchaseOrder.update({
			where: { id_purchase_order },
			data: {
				status,
				id_payment_operation,
				payment_hash: payment_hash ?? null,
			},
			select: {
				id_purchase_order: true,
				status: true,
				updated_at: true,
			},
		})

		return NextResponse.json({
			id_purchase_order: updated.id_purchase_order,
			status: updated.status,
			updated_at: updated.updated_at,
		})
	} catch (error: any) {
		if (error?.code === 'P2025') {
			return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
		}
		throw error
	}
}
