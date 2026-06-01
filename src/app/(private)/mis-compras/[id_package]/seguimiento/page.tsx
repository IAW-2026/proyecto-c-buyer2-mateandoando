import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { sellerService } from '@/services/seller'
import { shippingService } from '@/services/shipping'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import TrackingStatusCard from '@/components/orders/tracking-status-card'
import TrackingHistory from '@/components/orders/tracking-history'
import OrderInfoPanel from '@/components/orders/order-info-panel'

function effectivePrice(price: number, discount_pct: number): number {
	return discount_pct > 0
		? Math.round(price * (1 - discount_pct / 100))
		: price
}

export default async function SeguimientoPage({
	params,
}: {
	params: Promise<{ id_package: string }>
}) {
	const { id_package } = await params
	const { userId } = await auth()

	const buyer = await db.buyer.findUnique({
		where: { clerk_user_id: userId! },
		select: { id_buyer: true },
	})

	if (!buyer) notFound()

	// Get the tracked package
	const orderPackage = await db.package.findUnique({
		where: { id_package },
		include: {
			order: {
				select: {
					id_buyer: true,
					total_price: true,
					id_purchase_order: true,
					address: {
						select: {
							street:   true,
							floor_apt: true,
							city:     true,
							province: true,
						},
					},
				},
			},
		},
	})

	if (!orderPackage || orderPackage.order.id_buyer !== buyer.id_buyer) notFound()

	// Get ALL packages in this order (to list every seller + product)
	const allOrderPackages = await db.package.findMany({
		where: { id_purchase_order: orderPackage.order.id_purchase_order },
		include: { items: true },
	})

	const uniqueSellerIds = [...new Set(allOrderPackages.map(pkg => pkg.id_seller))]

	// Fetch tracking, all items and all sellers in parallel
	const [tracking, { items: allItems }, sellerResults] = await Promise.all([
		shippingService.trackPackage(id_package),
		sellerService.getItems(),
		Promise.all(uniqueSellerIds.map(id => sellerService.getSellerById(id))),
	])

	const itemMap: Record<string, typeof allItems[number]> = Object.fromEntries(
		allItems.map((i: { id_item: string }) => [i.id_item, i])
	)
	const sellerMap: Record<string, typeof sellerResults[number]> = Object.fromEntries(
		uniqueSellerIds.map((id, idx) => [id, sellerResults[idx]])
	)

	const enrichedPackages = allOrderPackages.map(itemsPackage => {
		const seller = sellerMap[itemsPackage.id_seller]
		const enrichedItems = itemsPackage.items.map(items => {
			const product = itemMap[items.id_item]
			return {
				...items,
				product_name: product?.name ?? 'Producto no disponible',
				unit_price: product
					? effectivePrice(product.price, product.discount_pct)
					: 0,
			}
		})
		
		return { ...itemsPackage, enrichedItems, seller }
	})

	const productsSubtotal = enrichedPackages.reduce(
		(acc, pkg) => acc + pkg.enrichedItems.reduce((a, i) => a + i.unit_price * i.quantity, 0),
		0
	)
	const orderTotal = Number(orderPackage.order.total_price)
	const shippingCost = orderTotal - productsSubtotal

	return (
		<>
			<div className="mb-8">
				<Link
					href="/mis-compras"
					className="flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors mb-6"
				>
					<ArrowLeft size={16} />
					Volver a mis compras
				</Link>

				<h1 className="text-headline-xl font-headline-xl text-primary mb-2">
					Seguimiento
				</h1>
				<p className="text-body-lg font-body-lg text-on-surface-variant">
					Pedido #{orderPackage.order.id_purchase_order.slice(0, 8).toUpperCase()}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

				{/* Left column: status + history */}
				<div className="lg:col-span-8 flex flex-col gap-6">
					<TrackingStatusCard
						status={tracking.status}
						carrier_name={tracking.carrier_name}
					/>
					<TrackingHistory history={tracking.history ?? []} />
				</div>

				{/* Right column: order info */}
				<div className="lg:col-span-4">
					<OrderInfoPanel
						id_purchase_order={orderPackage.order.id_purchase_order}
						enrichedPackages={enrichedPackages}
						productsSubtotal={productsSubtotal}
						shippingCost={shippingCost}
						orderTotal={orderTotal}
						address={orderPackage.order.address ?? undefined}
					/>
				</div>

			</div>
		</>
	)
}
