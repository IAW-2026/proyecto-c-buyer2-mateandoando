import Link from 'next/link'

type EnrichedItem = {
	id_package_item: string
	product_name: string
	quantity: number
	unit_price: number
}

export type EnrichedPackage = {
	id_package: string
	id_seller: string
	seller?: { name: string } | null
	enrichedItems: EnrichedItem[]
}

interface Props {
	id_purchase_order: string
	enrichedPackages: EnrichedPackage[]
	productsSubtotal: number
	shippingCost: number
	orderTotal: number
}

export default function OrderInfoPanel({
	id_purchase_order,
	enrichedPackages,
	productsSubtotal,
	shippingCost,
	orderTotal,
}: Props) {
	return (
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4 sticky top-6">
			<h2 className="text-headline-md font-headline-md text-on-surface">
				Información del pedido
			</h2>

			{/* Order ID */}
			<div className="flex justify-between text-body-sm border-t border-outline-variant pt-4">
				<span className="text-on-surface-variant">ID Pedido</span>
				<span className="text-on-surface font-mono text-label-sm">
					#{id_purchase_order.slice(0, 8).toUpperCase()}
				</span>
			</div>

			{/* Products grouped by seller */}
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
	)
}
