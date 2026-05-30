import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { OrderStatus } from '@prisma/client'

// Mock prices with discounts already applied — must match seller.mock.ts
// item_1: 8500 (no discount)
// item_2: 15000 × 0.80 = 12000 (20% off)
// item_3: 2500 (no discount)
// item_4: 3500 × 0.85 = 2975 (15% off)
// item_5: 4500 (no discount)
// item_6: 1800 × 0.90 = 1620 (10% off)

const SHIPPING = 500

const SEED_ORDERS = [
	{
		id_purchase_order: 'seed_order_aprobado',
		status: OrderStatus.APROBADO,
		total_price: 26950, // item_1(8500) + item_2(12000) + item_4×2(5950) + shipping(500)
		id_payment_operation: 'pay_seed_aprobado',
		daysAgo: 3,
		packages: [
			{
				id_package: 'seed_pkg_aprobado_1',
				id_seller: 'seller_1',
				items: [
					{ id_item: 'item_1', quantity: 1 }, // Mate Kit Premium
					{ id_item: 'item_2', quantity: 1 }, // Termo Stanley 1L
				],
			},
			{
				id_package: 'seed_pkg_aprobado_2',
				id_seller: 'seller_2',
				items: [
					{ id_item: 'item_4', quantity: 2 }, // Bombilla de Alpaca ×2
				],
			},
		],
	},
	{
		id_purchase_order: 'seed_order_pendiente',
		status: OrderStatus.PENDIENTE,
		total_price: 10000, // item_3×2(5000) + item_5(4500) + shipping(500)
		id_payment_operation: 'pay_seed_pendiente',
		daysAgo: 1,
		packages: [
			{
				id_package: 'seed_pkg_pendiente_1',
				id_seller: 'seller_2',
				items: [
					{ id_item: 'item_3', quantity: 2 }, // Yerba Mate Taragüi ×2
				],
			},
			{
				id_package: 'seed_pkg_pendiente_2',
				id_seller: 'seller_3',
				items: [
					{ id_item: 'item_5', quantity: 1 }, // Mate de Calabaza
				],
			},
		],
	},
	{
		id_purchase_order: 'seed_order_rechazado',
		status: OrderStatus.RECHAZADO,
		total_price: 5360, // item_6×3(4860) + shipping(500)
		id_payment_operation: 'pay_seed_rechazado',
		daysAgo: 10,
		packages: [
			{
				id_package: 'seed_pkg_rechazado_1',
				id_seller: 'seller_2',
				items: [
					{ id_item: 'item_6', quantity: 3 }, // Yerba Amanda ×3
				],
			},
		],
	},
	{
		id_purchase_order: 'seed_order_reembolsado',
		status: OrderStatus.REEMBOLSADO,
		total_price: 13500, // item_1(8500) + item_5(4500) + shipping(500)
		id_payment_operation: 'pay_seed_reembolsado',
		daysAgo: 20,
		packages: [
			{
				id_package: 'seed_pkg_reembolsado_1',
				id_seller: 'seller_1',
				items: [
					{ id_item: 'item_1', quantity: 1 }, // Mate Kit Premium
				],
			},
			{
				id_package: 'seed_pkg_reembolsado_2',
				id_seller: 'seller_3',
				items: [
					{ id_item: 'item_5', quantity: 1 }, // Mate de Calabaza
				],
			},
		],
	},
]

export async function POST() {
	if (process.env.NODE_ENV === 'production')
		return new Response(null, { status: 404 })

	const { userId } = await auth()
	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const buyer = await db.buyer.findUnique({
		where: { clerk_user_id: userId },
		select: { id_buyer: true },
	})

	if (!buyer)
		return NextResponse.json({ error: 'Buyer not found. Log in first to auto-provision the account.' }, { status: 404 })

	// Delete previous seeded data in dependency order (items → packages → orders)
	const seedPackageIds = SEED_ORDERS.flatMap(o => o.packages.map(p => p.id_package))

	await db.packageItem.deleteMany({
		where: { id_package: { in: seedPackageIds } },
	})
	await db.package.deleteMany({
		where: { id_package: { in: seedPackageIds } },
	})
	await db.purchaseOrder.deleteMany({
		where: {
			id_buyer: buyer.id_buyer,
			id_purchase_order: { in: SEED_ORDERS.map(o => o.id_purchase_order) },
		},
	})

	// Create all orders
	const now = new Date()

	await db.$transaction(
		SEED_ORDERS.map(order =>
			db.purchaseOrder.create({
				data: {
					id_purchase_order: order.id_purchase_order,
					id_buyer: buyer.id_buyer,
					total_price: order.total_price,
					status: order.status,
					id_payment_operation: order.id_payment_operation,
					created_at: new Date(now.getTime() - order.daysAgo * 24 * 60 * 60 * 1000),
					packages: {
						create: order.packages.map(pkg => ({
							id_package: pkg.id_package,
							id_seller: pkg.id_seller,
							items: {
								create: pkg.items,
							},
						})),
					},
				},
			})
		)
	)

	return NextResponse.json({
		ok: true,
		message: `${SEED_ORDERS.length} órdenes creadas.`,
		orders: SEED_ORDERS.map(o => ({
			id: o.id_purchase_order,
			status: o.status,
			total: o.total_price,
			packages: o.packages.length,
		})),
	})
}
