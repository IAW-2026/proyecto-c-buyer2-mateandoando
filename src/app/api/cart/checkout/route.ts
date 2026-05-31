import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sellerService } from '@/services/seller'
import { paymentsService } from '@/services/payments'

export async function POST(req: NextRequest) {
	const { userId } = await auth()

	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const { id_buyer, address, items, shipping_cost } = await req.json()

	// 1. Snapshot prices + group by seller via Seller App
	const purchaseOrder = await sellerService.createPurchaseOrder(
		id_buyer,
		items,
		address.street,
		address.zip_code,
	)

	// 2. Request payment from Payments App
	const payment = await paymentsService.createPayment()

	const totalWithShipping = purchaseOrder.total_price + (shipping_cost ?? 0)

	// 3. Persist PurchaseOrder + Packages + Address in a single transaction
	await db.$transaction([
		db.purchaseOrder.create({
			data: {
				id_purchase_order: purchaseOrder.id_purchase_order,
				id_buyer,
				total_price: totalWithShipping,
				status: 'PENDIENTE',
				id_payment_operation: payment.id_payment_operation,
			},
		}),
		...purchaseOrder.packages.map(pkg =>
			db.package.create({
				data: {
					id_package: pkg.id_package,
					id_purchase_order: purchaseOrder.id_purchase_order,
					id_seller: pkg.id_seller,
					items: {
						create: pkg.items.map((pkgItem: { id_item: string; quantity: number }) => ({
							id_item: pkgItem.id_item,
							quantity: pkgItem.quantity,
						})),
					},
				},
			})
		),
		db.address.create({
			data: {
				id_buyer,
				alias: 'Envío',
				street: address.street,
				floor_apt: address.floor_apt ?? null,
				city: address.city,
				province: address.province,
				zip_code: address.zip_code,
			},
		}),
		db.cartItem.deleteMany({
			where: { cart: { id_buyer } },
		}),
	])

	return NextResponse.json({
		checkout_url: payment.checkout_url,
		id_payment_operation: payment.id_payment_operation,
		id_purchase_order: purchaseOrder.id_purchase_order,
	})
}