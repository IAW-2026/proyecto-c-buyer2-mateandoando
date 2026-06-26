export type CartItem = {
	id_cart_item: string
	id_item: string
	quantity: number
	product: {
		id_item: string
		name: string
		price: number
		description: string
		category_name: string
		id_seller: string
		seller_name: string
		discount_pct: number
	}
}

interface Props {
	items: CartItem[]
	shippingCost: number | null
	shippingDays: number | null
	isEstimating: boolean
}

function effectivePrice(price: number, discount_pct: number): number {
	return discount_pct > 0
		? Math.round(price * (1 - discount_pct / 100))
		: price
}

export default function CheckoutSummary({ items, shippingCost, shippingDays, isEstimating }: Props) {
	const subtotal = items.reduce(
		(acc, item) => acc + effectivePrice(item.product.price, item.product.discount_pct) * item.quantity,
		0
	)
	const total = shippingCost !== null ? subtotal + shippingCost : null

	return (
		<div className="lg:col-span-5">
			<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4 sticky top-6">
				<h2 className="text-headline-md font-headline-md text-on-surface">
					Resumen del pedido
				</h2>

				<div className="flex flex-col divide-y divide-outline-variant">
					{items.map(item => {
						const price = effectivePrice(item.product.price, item.product.discount_pct)
						return (
							<div key={item.id_cart_item} className="flex justify-between items-center py-3 gap-4">
								<div className="flex flex-col min-w-0">
									<p className="text-body-md text-on-surface truncate">
										{item.product.name}
									</p>
									<p className="text-label-sm text-on-surface-variant">
										x{item.quantity}
									</p>
								</div>
								<p className="text-body-md font-semibold text-on-surface flex-shrink-0">
									${(price * item.quantity).toLocaleString('es-AR')}
								</p>
							</div>
						)
					})}
				</div>

				<div className="flex justify-between text-body-md text-on-surface-variant border-t border-outline-variant pt-4">
					<span>Subtotal</span>
					<span>${subtotal.toLocaleString('es-AR')}</span>
				</div>

				<div className="flex justify-between text-body-md text-on-surface-variant">
					<span>
						Envío{shippingDays !== null && !isEstimating && ` (${shippingDays} días hábiles)`}
					</span>
					<span>
						{isEstimating
							? 'Calculando...'
							: shippingCost !== null
								? `$${shippingCost.toLocaleString('es-AR')}`
								: 'Ingresá tu código postal'
						}
					</span>
				</div>

				<div className="flex justify-between text-headline-md font-headline-md text-on-surface border-t border-outline-variant pt-4">
					<span>Total</span>
					<span>
						{total !== null
							? `$${total.toLocaleString('es-AR')}`
							: '—'
						}
					</span>
				</div>
			</div>
		</div>
	)
}
