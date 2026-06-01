'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'

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
	item: CartItem
	onUpdateQuantity: (id_cart_item: string, newQuantity: number) => void
	onRemove: (id_cart_item: string) => void
}

export function effectivePrice(item: CartItem): number {
	return item.product.discount_pct > 0
		? Math.round(item.product.price * (1 - item.product.discount_pct / 100)) // TODO: Test this
		: item.product.price
}

export default function CartItemRow({ item, onUpdateQuantity, onRemove }: Props) {
	const price = effectivePrice(item)

	return (
		<div className="flex items-center gap-4 py-5">

			{/* Image placeholder */}
			<div className="w-20 h-20 rounded-lg bg-surface-container flex-shrink-0 border border-outline-variant" />

			{/* Info */}
			<div className="flex-grow min-w-0">
				<p className="text-body-md font-semibold text-on-surface truncate">
					{item.product.name}
				</p>
				<p className="text-label-sm text-on-surface-variant">
					{item.product.seller_name}
				</p>
				<p className="text-body-md font-bold text-primary mt-1">
					${price.toLocaleString('es-AR')}
				</p>
			</div>

			{/* Quantity stepper */}
			<div className="flex items-center gap-2 flex-shrink-0">
				<button
					onClick={() => onUpdateQuantity(item.id_cart_item, item.quantity - 1)}
					disabled={item.quantity <= 1}
					className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center transition-colors"
					aria-label="Reducir cantidad"
				>
					<Minus size={14} />
				</button>

				<span className="w-8 text-center text-body-md select-none">
					{item.quantity}
				</span>

				<button
					onClick={() => onUpdateQuantity(item.id_cart_item, item.quantity + 1)}
					className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center transition-colors"
					aria-label="Aumentar cantidad"
				>
					<Plus size={14} />
				</button>
			</div>

			{/* Line total */}
			<p className="w-28 text-right text-body-md font-bold text-on-surface flex-shrink-0">
				${(price * item.quantity).toLocaleString('es-AR')}
			</p>

			{/* Delete */}
			<button
				onClick={() => onRemove(item.id_cart_item)}
				className="text-on-surface-variant hover:text-error transition-colors p-1 flex items-center justify-center"
				aria-label={`Eliminar ${item.product.name}`}
			>
				<Trash2 size={18} />
			</button>

		</div>
	)
}
