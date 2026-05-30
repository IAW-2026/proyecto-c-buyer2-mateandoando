'use client'

import { useState } from 'react'
import CartItemRow, { CartItem, effectivePrice } from '@/components/cart/cart-item-row'
import OrderSummary from '@/components/cart/order-summary'
import EmptyCart from '@/components/cart/empty-cart'

interface Props {
	initialItems: CartItem[]
}

export default function CartContent({ initialItems }: Props) {
	const [items, setItems] = useState<CartItem[]>(initialItems)

	const subtotal = items.reduce(
		(acc, item) => acc + effectivePrice(item) * item.quantity, 0
	)

	async function updateQuantity(id_cart_item: string, newQuantity: number) {
		if (newQuantity < 1)
			return

		const previous = items // snapshot current state

		// update the items in the UI
		setItems(prev =>
			prev.map(item =>
				item.id_cart_item === id_cart_item ? { ...item, quantity: newQuantity } : item
			)
		)

		// update db
		const res = await fetch(`/api/cart/items/${id_cart_item}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ quantity: newQuantity }),
		})

		if (!res.ok)
			setItems(previous)
			// Display an error message?
	}

	async function removeItem(id_cart_item: string) {
		const previous = items

		setItems(prev => prev.filter(
			item => item.id_cart_item !== id_cart_item)
		)

		// Remove from db
		const res = await fetch(`/api/cart/items/${id_cart_item}`, {
			method: 'DELETE',
		})

		if (!res.ok)
			setItems(previous)
	}

	if (items.length === 0) {
		// Cart is empty
		return <EmptyCart />
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

			{/* Items list */}
			<div className="lg:col-span-8 flex flex-col divide-y divide-outline-variant">
				{items.map((item) => (
					<CartItemRow
						key={item.id_cart_item}
						item={item}
						onUpdateQuantity={updateQuantity}
						onRemove={removeItem}
					/>
				))}
			</div>

			<OrderSummary
				itemCount={items.length}
				subtotal={subtotal}
			/>
		</div>
	)
}
