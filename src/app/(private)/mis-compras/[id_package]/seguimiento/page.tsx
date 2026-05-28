import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { sellerService } from '@/services/seller'
import { shippingService } from '@/services/shipping'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Truck } from 'lucide-react'

const trackingStatusLabel: Record<string, string> = {
	RETIRADO:    'Retirado del vendedor',
	EN_TRANSITO: 'En tránsito',
	ENTREGADO:   'Entregado',
	RETORNADO:   'Retornado',
}

const trackingStatusColor: Record<string, string> = {
	RETIRADO:    'text-secondary',
	EN_TRANSITO: 'text-secondary',
	ENTREGADO:   'text-primary',
	RETORNADO:   'text-error',
}

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

	// Enrich all packages with seller info and product details in parallel
	const [tracking, enrichedPackages] = await Promise.all([
		shippingService.trackPackage(id_package),
		Promise.all(
			allOrderPackages.map(async (pkg) => {
				const [enrichedItems, seller] = await Promise.all([
					Promise.all(
						pkg.items.map(async (pkgItem) => {
							const product = await sellerService.getItemDetail('', pkgItem.id_item)
							return {
								...pkgItem,
								product_name: product?.name ?? 'Producto no disponible',
								unit_price: product
									? effectivePrice(product.price, product.discount_pct)
									: 0,
							}
						})
					),
					sellerService.getSellerById(pkg.id_seller),
				])
				return { ...pkg, enrichedItems, seller }
			})
		),
	])

	const hasHistory = tracking.history && tracking.history.length > 0
	const productsSubtotal = enrichedPackages.reduce(
		(acc, pkg) => acc + pkg.enrichedItems.reduce((a, i) => a + i.unit_price * i.quantity, 0),
		0
	)
	const orderTotal = Number(orderPackage.order.total_price)
	const shippingCost = orderTotal - productsSubtotal

	// Views
	const statusCardView =
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<Truck size={24} className="text-primary" />
				<div>
					<p className="text-label-sm text-on-surface-variant">Estado actual</p>
					<p className={`text-headline-md font-headline-md ${trackingStatusColor[tracking.status] ?? 'text-on-surface'}`}>
						{trackingStatusLabel[tracking.status] ?? tracking.status}
					</p>
				</div>
			</div>

			{tracking.carrier_name && (
				<p className="text-body-md text-on-surface-variant border-t border-outline-variant pt-4">
					Transportista: <span className="text-on-surface font-medium">{tracking.carrier_name}</span>
				</p>
			)}
		</div>

	const historyView =
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
			<h2 className="text-headline-md font-headline-md text-on-surface">
				Historial
			</h2>
			<div className="flex flex-col gap-3">
				{tracking.history.map((event: { status: string; description?: string; timestamp?: string }, index: number) => (
					<div key={index} className="flex gap-4 items-start">
						<div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
						<div className="flex flex-col gap-0.5">
							<p className="text-body-md text-on-surface font-medium">
								{trackingStatusLabel[event.status] ?? event.status}
							</p>
							{event.description && (
								<p className="text-label-sm text-on-surface-variant">{event.description}</p>
							)}
							{event.timestamp && (
								<p className="text-label-sm text-on-surface-variant">
									{new Date(event.timestamp).toLocaleDateString('es-AR', {
										day: '2-digit',
										month: 'long',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</div>

	const emptyHistoryView =
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
			<p className="text-body-md text-on-surface-variant">
				Aún no hay eventos de seguimiento registrados.
			</p>
		</div>

	const packageInfoView =
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4 sticky top-6">
			<div className="flex items-center gap-3">
				<Package size={20} className="text-on-surface-variant" />
				<h2 className="text-headline-md font-headline-md text-on-surface">
					Información del pedido
				</h2>
			</div>

			{/* Order ID */}
			<div className="flex justify-between text-body-sm border-t border-outline-variant pt-4">
				<span className="text-on-surface-variant">ID Pedido</span>
				<span className="text-on-surface font-mono text-label-sm">
					#{orderPackage.order.id_purchase_order.slice(0, 8).toUpperCase()}
				</span>
			</div>

			{/* Products are grouped by seller */}
			{enrichedPackages.map(pkg => (
				<div key={pkg.id_package} className="flex flex-col gap-2 border-t border-outline-variant pt-4">
					<Link
						href={`/vendedores/${pkg.id_seller}`}
						className="text-label-md text-primary hover:underline font-medium"
					>
						{pkg.seller?.name ?? pkg.id_seller}
					</Link>
					{pkg.enrichedItems.map(item => (
						<div key={item.id_package_item} className="flex justify-between items-start gap-2 text-body-sm">
							<span className="text-on-surface">
								{item.product_name}
								<span className="text-on-surface-variant"> ×{item.quantity}</span>
							</span>
							<span className="text-on-surface font-medium flex-shrink-0">
								${(item.unit_price * item.quantity).toLocaleString('es-AR')}
							</span>
						</div>
					))}
				</div>
			))}

			{/* Amounts */}
			<div className="flex flex-col gap-2 border-t border-outline-variant pt-4">
				<div className="flex justify-between text-body-sm">
					<span className="text-on-surface-variant">Subtotal productos</span>
					<span className="text-on-surface">${productsSubtotal.toLocaleString('es-AR')}</span>
				</div>
				<div className="flex justify-between text-body-sm">
					<span className="text-on-surface-variant">Envío</span>
					<span className="text-on-surface">${shippingCost.toLocaleString('es-AR')}</span>
				</div>
				<div className="flex justify-between text-body-md font-semibold text-on-surface border-t border-outline-variant pt-2 mt-1">
					<span>Total</span>
					<span>${orderTotal.toLocaleString('es-AR')}</span>
				</div>
			</div>
		</div>

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
					{statusCardView}
					{hasHistory ? historyView : emptyHistoryView}
				</div>

				{/* Right column: package info */}
				<div className="lg:col-span-4">
					{packageInfoView}
				</div>

			</div>
		</>
	)
}
