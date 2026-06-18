import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sellerService } from '@/services/seller'
import { paymentsService } from '@/services/payments'

export async function POST(req: NextRequest) {
	const { userId, getToken } = await auth()

	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const [body, token] = await Promise.all([
		req.json(),
		getToken(),
	])

	const { id_buyer, address, items, shipping_cost } = body

	// Validate required top-level fields
	if (!id_buyer || !address || !Array.isArray(items) || items.length === 0) {
		return NextResponse.json(
			{ error: 'Missing required fields: id_buyer, address, items' },
			{ status: 400 },
		)
	}

	// Validate required address fields
	const missingAddressFields = (['street', 'city', 'province', 'zip_code'] as const)
		.filter(field => !address[field]?.toString().trim())

	if (missingAddressFields.length > 0) {
		return NextResponse.json(
			{ error: `Missing required address fields: ${missingAddressFields.join(', ')}` },
			{ status: 400 },
		)
	}

	// 1. Snapshot prices + group by seller via Seller App
	const purchaseOrder = await sellerService.createPurchaseOrder(
		id_buyer,
		items,
		address.street,
		address.zip_code,
		token ?? undefined,
	)

	if (purchaseOrder.error || !purchaseOrder.packages) {
		return NextResponse.json(
			{ error: purchaseOrder.error ?? 'Error al crear la orden en Seller App' },
			{ status: 502 },
		)
	}

	const totalWithShipping = purchaseOrder.total_price + (shipping_cost ?? 0)

	// Group request items by seller so we can associate them with each package
	const { items: catalogItems } = await sellerService.getItems()
	const itemSellerMap: Record<string, string> = Object.fromEntries(
		catalogItems.map(ci => [ci.id_item, ci.id_seller])
	)
	const itemsBySeller: Record<string, { id_item: string; quantity: number }[]> = {}
	for (const item of items) {
		const sellerId = itemSellerMap[item.id_item]
		if (sellerId) {
			if (!itemsBySeller[sellerId]) itemsBySeller[sellerId] = []
			itemsBySeller[sellerId].push(item)
		}
	}

	// 2. Request payment from Payments App
	const payment = await paymentsService.createPayment(
		{
			id_purchase_order: purchaseOrder.id_purchase_order,
			id_buyer,
			total_price: totalWithShipping,
			packages: purchaseOrder.packages.map((pkg: { id_package: string; id_seller: string }) => ({
				id_package: pkg.id_package,
				id_seller: pkg.id_seller,
			})),
		},
		token ?? undefined,
	)

	// 3. Persist Address, PurchaseOrder and Packages sequentially
	// (PrismaNeon HTTP adapter does not support interactive transactions)
	const savedAddress = await db.address.create({
		data: {
			id_buyer,
			alias: 'Envío',
			street: address.street,
			floor_apt: address.floor_apt ?? null,
			city: address.city,
			province: address.province,
			zip_code: address.zip_code,
		},
	})

	await db.purchaseOrder.create({
		data: {
			id_purchase_order: purchaseOrder.id_purchase_order,
			id_buyer,
			id_address: savedAddress.id_address,
			total_price: totalWithShipping,
			status: 'PENDIENTE',
			id_payment_operation: payment.id_payment_operation,
		},
	})

	for (const pkg of purchaseOrder.packages) {
		await db.package.create({
			data: {
				id_package: pkg.id_package,
				id_purchase_order: purchaseOrder.id_purchase_order,
				id_seller: pkg.id_seller,
				items: {
					create: (itemsBySeller[pkg.id_seller] ?? []).map((pkgItem: { id_item: string; quantity: number }) => ({
						id_item: pkgItem.id_item,
						quantity: pkgItem.quantity,
					})),
				},
			},
		})
	}

	await db.cartItem.deleteMany({
		where: { cart: { id_buyer } },
	})

	return NextResponse.json({
		checkout_url: payment.checkout_url,
		id_payment_operation: payment.id_payment_operation,
		id_purchase_order: purchaseOrder.id_purchase_order,
	})
}