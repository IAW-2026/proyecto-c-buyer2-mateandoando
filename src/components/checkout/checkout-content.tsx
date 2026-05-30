'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddressForm, { Address } from '@/components/checkout/address-form'
import CheckoutSummary, { CartItem } from '@/components/checkout/checkout-summary'

interface Props {
	items: CartItem[]
	id_buyer: string
	shippingCost: number
	shippingDays: number
}

type FormState = 'idle' | 'loading' | 'error'

export default function CheckoutForm({ items, id_buyer, shippingCost, shippingDays }: Props) {
	const router = useRouter()
	const [formState, setFormState] = useState<FormState>('idle')
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	async function handleSubmit(address: Address) {
		setFormState('loading')
		setErrorMessage(null)

		const response = await fetch('/api/cart/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id_buyer,
				address,
				items: items.map(item => ({ id_item: item.id_item, quantity: item.quantity })),
				shipping_cost: shippingCost,
			}),
		})

		if (!response.ok) {
			setFormState('error')
			setErrorMessage('Hubo un error al procesar tu pedido. Intentá de nuevo.')
			return
		}

		const { checkout_url } = await response.json()
		router.push(checkout_url)
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
			<AddressForm
				onSubmit={handleSubmit}
				isLoading={formState === 'loading'}
				errorMessage={errorMessage}
			/>
			<CheckoutSummary
				items={items}
				shippingCost={shippingCost}
				shippingDays={shippingDays}
			/>
		</div>
	)
}
