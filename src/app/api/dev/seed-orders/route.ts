import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { OrderStatus } from '@prisma/client'

// ── Effective prices (discount already applied) ───────────────────────────────
// item_1:  8500      (Mate Kit Premium,        0%)
// item_2:  12000     (Termo Stanley 1L,        20%  → 15000×0.80)
// item_4:  2975      (Bombilla de Alpaca,      15%  → 3500×0.85)
// item_5:  4500      (Mate de Calabaza,        0%)
// item_6:  1620      (Yerba Amanda 500g,       10%  → 1800×0.90)
// item_7:  16200     (Termo Cebador 1.5L,      10%  → 18000×0.90)
// item_8:  2800      (Yerba CBSé 1kg,          0%)
// item_9:  6500      (Kit Viajero,             0%)
// item_10: 5500      (Mate de Madera Lapacho,  0%)
// item_13: 12000     (Kit Gaucho Completo,     0%)
// item_14: 18700     (Termo Stanley XL 1.9L,   15%  → 22000×0.85)
// item_15: 3800      (Portamate de Cuero,      0%)
// item_17: 26250     (Kit Estancia Premium,    25%  → 35000×0.75)
// ─────────────────────────────────────────────────────────────────────────────

const SHIPPING = 500

// Stable address IDs so cleanup is deterministic
const SEED_ADDRESSES = [
	{
		id_address: 'seed_addr_caba',
		alias:     'Envío',
		street:    'Av. Corrientes 1234',
		floor_apt: '3° B',
		city:      'Buenos Aires',
		province:  'Ciudad Autónoma de Buenos Aires',
		zip_code:  '1043',
	},
	{
		id_address: 'seed_addr_cba',
		alias:     'Envío',
		street:    '27 de Abril 456',
		floor_apt: null,
		city:      'Córdoba',
		province:  'Córdoba',
		zip_code:  '5000',
	},
	{
		id_address: 'seed_addr_ros',
		alias:     'Envío',
		street:    'San Martín 789',
		floor_apt: null,
		city:      'Rosario',
		province:  'Santa Fe',
		zip_code:  '2000',
	},
	{
		id_address: 'seed_addr_mza',
		alias:     'Envío',
		street:    'Av. San Martín 321',
		floor_apt: null,
		city:      'Mendoza',
		province:  'Mendoza',
		zip_code:  '5500',
	},
	{
		id_address: 'seed_addr_tuc',
		alias:     'Envío',
		street:    'Av. Alem 100',
		floor_apt: '1° A',
		city:      'San Miguel de Tucumán',
		province:  'Tucumán',
		zip_code:  '4000',
	},
	{
		id_address: 'seed_addr_lp',
		alias:     'Envío',
		street:    'Calle 7 Nro. 850',
		floor_apt: null,
		city:      'La Plata',
		province:  'Buenos Aires',
		zip_code:  '1900',
	},
]

const SEED_ORDERS = [
	// ── APROBADO ──────────────────────────────────────────────────────────────
	{
		id_purchase_order:    'seed_order_aprobado_1',
		status:               OrderStatus.APROBADO,
		total_price:          26950, // item_1(8500) + item_2(12000) + item_4×2(5950) + shipping(500)
		id_payment_operation: 'pay_seed_aprobado_1',
		id_address:           'seed_addr_caba',
		daysAgo:              3,
		packages: [
			{
				id_package: 'seed_pkg_aprobado_1a',
				id_seller:  'seller_1',
				items: [
					{ id_item: 'item_1', quantity: 1 }, // Mate Kit Premium
					{ id_item: 'item_2', quantity: 1 }, // Termo Stanley 1L
				],
			},
			{
				id_package: 'seed_pkg_aprobado_1b',
				id_seller:  'seller_2',
				items: [
					{ id_item: 'item_4', quantity: 2 }, // Bombilla de Alpaca ×2
				],
			},
		],
	},
	{
		id_purchase_order:    'seed_order_aprobado_2',
		status:               OrderStatus.APROBADO,
		total_price:          28700, // item_7(16200) + item_9(6500) + item_10(5500) + shipping(500)
		id_payment_operation: 'pay_seed_aprobado_2',
		id_address:           'seed_addr_cba',
		daysAgo:              8,
		packages: [
			{
				id_package: 'seed_pkg_aprobado_2a',
				id_seller:  'seller_1',
				items: [
					{ id_item: 'item_7', quantity: 1 }, // Termo Cebador 1.5L
					{ id_item: 'item_9', quantity: 1 }, // Kit Viajero
				],
			},
			{
				id_package: 'seed_pkg_aprobado_2b',
				id_seller:  'seller_3',
				items: [
					{ id_item: 'item_10', quantity: 1 }, // Mate de Madera Lapacho
				],
			},
		],
	},

	// ── RECHAZADO ─────────────────────────────────────────────────────────────
	{
		id_purchase_order:    'seed_order_rechazado_1',
		status:               OrderStatus.RECHAZADO,
		total_price:          5360, // item_6×3(4860) + shipping(500)
		id_payment_operation: 'pay_seed_rechazado_1',
		id_address:           'seed_addr_ros',
		daysAgo:              12,
		packages: [
			{
				id_package: 'seed_pkg_rechazado_1a',
				id_seller:  'seller_2',
				items: [
					{ id_item: 'item_6', quantity: 3 }, // Yerba Amanda ×3
				],
			},
		],
	},
	{
		id_purchase_order:    'seed_order_rechazado_2',
		status:               OrderStatus.RECHAZADO,
		total_price:          18100, // item_13(12000) + item_8×2(5600) + shipping(500)
		id_payment_operation: 'pay_seed_rechazado_2',
		id_address:           'seed_addr_mza',
		daysAgo:              18,
		packages: [
			{
				id_package: 'seed_pkg_rechazado_2a',
				id_seller:  'seller_1',
				items: [
					{ id_item: 'item_13', quantity: 1 }, // Kit Gaucho Completo
				],
			},
			{
				id_package: 'seed_pkg_rechazado_2b',
				id_seller:  'seller_2',
				items: [
					{ id_item: 'item_8', quantity: 2 }, // Yerba CBSé ×2
				],
			},
		],
	},

	// ── REEMBOLSADO ───────────────────────────────────────────────────────────
	{
		id_purchase_order:    'seed_order_reembolsado_1',
		status:               OrderStatus.REEMBOLSADO,
		total_price:          32200, // item_1(8500) + item_14(18700) + item_5(4500) + shipping(500)
		id_payment_operation: 'pay_seed_reembolsado_1',
		id_address:           'seed_addr_tuc',
		daysAgo:              22,
		packages: [
			{
				id_package: 'seed_pkg_reembolsado_1a',
				id_seller:  'seller_1',
				items: [
					{ id_item: 'item_1',  quantity: 1 }, // Mate Kit Premium
					{ id_item: 'item_14', quantity: 1 }, // Termo Stanley XL
				],
			},
			{
				id_package: 'seed_pkg_reembolsado_1b',
				id_seller:  'seller_3',
				items: [
					{ id_item: 'item_5', quantity: 1 }, // Mate de Calabaza
				],
			},
		],
	},
	{
		id_purchase_order:    'seed_order_reembolsado_2',
		status:               OrderStatus.REEMBOLSADO,
		total_price:          30550, // item_17(26250) + item_15(3800) + shipping(500)
		id_payment_operation: 'pay_seed_reembolsado_2',
		id_address:           'seed_addr_lp',
		daysAgo:              35,
		packages: [
			{
				id_package: 'seed_pkg_reembolsado_2a',
				id_seller:  'seller_1',
				items: [
					{ id_item: 'item_17', quantity: 1 }, // Kit Estancia Premium
				],
			},
			{
				id_package: 'seed_pkg_reembolsado_2b',
				id_seller:  'seller_3',
				items: [
					{ id_item: 'item_15', quantity: 1 }, // Portamate de Cuero
				],
			},
		],
	},
]

export async function POST() {
	const { userId } = await auth()
	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const buyer = await db.buyer.findUnique({
		where: { clerk_user_id: userId },
		select: { id_buyer: true },
	})

	if (!buyer)
		return NextResponse.json(
			{ error: 'Buyer not found. Iniciá sesión en la app primero para crear tu perfil.' },
			{ status: 404 },
		)

	// Prefix all seed IDs with a buyer-specific slug so different users
	// can each have their own copy of the seed data without collisions.
	const prefix = buyer.id_buyer.slice(0, 8)
	const p = (base: string) => `${prefix}_${base}`

	try {
		// ── Cleanup in dependency order ─────────────────────────────────────────
		const seedPackageIds = SEED_ORDERS.flatMap(o => o.packages.map(pk => p(pk.id_package)))
		const seedOrderIds   = SEED_ORDERS.map(o => p(o.id_purchase_order))
		const seedAddressIds = SEED_ADDRESSES.map(a => p(a.id_address))

		await db.packageItem.deleteMany({ where: { id_package: { in: seedPackageIds } } })
		await db.package.deleteMany({ where: { id_package: { in: seedPackageIds } } })
		await db.purchaseOrder.deleteMany({ where: { id_purchase_order: { in: seedOrderIds } } })
		await db.address.deleteMany({ where: { id_address: { in: seedAddressIds } } })

		// ── Create sequentially (PrismaNeon HTTP driver doesn't support ──────────
		// ── interactive transactions, so we commit each step individually) ───────
		const now = new Date()

		// 1. Addresses
		for (const addr of SEED_ADDRESSES) {
			await db.address.create({
				data: { ...addr, id_address: p(addr.id_address), id_buyer: buyer.id_buyer },
			})
		}

		// 2. Orders
		for (const order of SEED_ORDERS) {
			await db.purchaseOrder.create({
				data: {
					id_purchase_order:    p(order.id_purchase_order),
					id_buyer:             buyer.id_buyer,
					id_address:           p(order.id_address),
					total_price:          order.total_price,
					status:               order.status,
					id_payment_operation: p(order.id_payment_operation),
					created_at: new Date(now.getTime() - order.daysAgo * 24 * 60 * 60 * 1000),
				},
			})
		}

		// 3. Packages
		for (const order of SEED_ORDERS) {
			for (const pkg of order.packages) {
				await db.package.create({
					data: {
						id_package:        p(pkg.id_package),
						id_purchase_order: p(order.id_purchase_order),
						id_seller:         pkg.id_seller,
					},
				})
			}
		}

		// 4. Package items
		for (const order of SEED_ORDERS) {
			for (const pkg of order.packages) {
				for (const item of pkg.items) {
					await db.packageItem.create({
						data: {
							id_package: p(pkg.id_package),
							id_item:    item.id_item,
							quantity:   item.quantity,
						},
					})
				}
			}
		}

		return NextResponse.json({
			ok:      true,
			message: `${SEED_ORDERS.length} órdenes creadas para el comprador (prefijo: ${prefix}).`,
			orders:  SEED_ORDERS.map(o => ({
				id:       p(o.id_purchase_order),
				status:   o.status,
				total:    o.total_price,
				address:  p(o.id_address),
				packages: o.packages.length,
			})),
		})
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err)
		console.error('[seed-orders]', message)
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
