import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { paymentsService } from '@/services/payments'
import { shippingService } from '@/services/shipping'

const DISPATCHED_STATUSES = ['DESPACHADO', 'EN_TRANSITO', 'ENTREGADO', 'RETORNADO']

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id_purchase_order: string }> },
) {
	const { userId, getToken } = await auth()

	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const { id_purchase_order } = await params

	const buyer = await db.buyer.findUnique({
		where: { clerk_user_id: userId },
		select: { id_buyer: true },
	})

	if (!buyer)
		return NextResponse.json({ error: 'Buyer not found' }, { status: 404 })

	const order = await db.purchaseOrder.findUnique({
		where: { id_purchase_order },
		select: {
			id_buyer: true,
			status: true,
			id_payment_operation: true,
		},
	})

	if (!order || order.id_buyer !== buyer.id_buyer)
		return NextResponse.json({ error: 'Order not found' }, { status: 404 })

	if (order.status !== 'APROBADO')
		return NextResponse.json(
			{ error: 'Only APROBADO orders can be cancelled' },
			{ status: 409 },
		)

	const token = await getToken()

	// APROBADO: verify no package has been dispatched yet
	const packages = await db.package.findMany({
		where: { id_purchase_order },
		select: { id_package: true },
	})

	const trackingResults = await Promise.all(
		packages.map(pkg => shippingService.trackPackage(pkg.id_package))
	)

	const anyDispatched = trackingResults.some(t => DISPATCHED_STATUSES.includes(t.status))

	if (anyDispatched)
		return NextResponse.json(
			{ error: 'No se puede cancelar: uno o más paquetes ya fueron despachados' },
			{ status: 409 },
		)

	await paymentsService.cancelPayment(order.id_payment_operation, token ?? undefined)

	const updated = await db.purchaseOrder.update({
		where: { id_purchase_order },
		data: { status: 'REEMBOLSADO' },
		select: { id_purchase_order: true, status: true, updated_at: true },
	})

	return NextResponse.json(updated)
}
