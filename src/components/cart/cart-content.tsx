'use client'

import { useState } from 'react'
import CartItemRow, { CartItem, effectivePrice } from '@/components/cart/cart-item-row'
import OrderSummary from '@/components/cart/order-summary'
import EmptyCart from '@/components/cart/empty-cart'
import { useCartStore } from '@/store/cart-store'

interface Props {
	initialItems: CartItem[]
}

export default function CartContent({ initialItems }: Props) {
	const [items, setItems] = useState<CartItem[]>(initialItems)
	const increment = useCartStore(s => s.increment)
	const decrement = useCartStore(s => s.decrement)

	const subtotal = items.reduce(
		(acc, item) => acc + effectivePrice(item) * item.quantity, 0
	)

	async function updateQuantity(id_cart_item: string, newQuantity: number) {
		if (newQuantity < 1)
			return

		const previousCartItems = items
		const olditemsQuantityInCart = items.find(i => i.id_cart_item === id_cart_item)?.quantity ?? newQuantity
		const deltaQuantityInCart = newQuantity - olditemsQuantityInCart

		// Optimistic update
		setItems(prev =>
			prev.map(item =>
				item.id_cart_item === id_cart_item ? { ...item, quantity: newQuantity } : item
			)
		)

		if (deltaQuantityInCart > 0)
			increment(deltaQuantityInCart)
		else if (deltaQuantityInCart < 0)
			decrement(-deltaQuantityInCart)

		const res = await fetch(`/api/cart/items/${id_cart_item}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ quantity: newQuantity }),
		})

		if (!res.ok) {
			// Rollback UI and store
			setItems(previousCartItems)
			
			if (deltaQuantityInCart > 0)
				decrement(deltaQuantityInCart)
			else if (deltaQuantityInCart < 0)
				increment(-deltaQuantityInCart)
		}
	}

	async function removeItem(id_cart_item: string) {
		const previousCartItems = items
		const removedQuantity = items.find(i => i.id_cart_item === id_cart_item)?.quantity ?? 0

		// Optimistic update
		setItems(prev => prev.filter(item => item.id_cart_item !== id_cart_item))
		decrement(removedQuantity)

		const res = await fetch(`/api/cart/items/${id_cart_item}`, {
			method: 'DELETE',
		})

		if (!res.ok) {
			// Rollback UI and store
			setItems(previousCartItems)
			increment(removedQuantity)
		}
	}

	if (items.length === 0)
		return <EmptyCart />

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
