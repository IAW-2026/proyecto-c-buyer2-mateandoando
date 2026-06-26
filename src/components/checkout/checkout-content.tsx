'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AddressForm, { Address } from '@/components/checkout/address-form'
import CheckoutSummary, { CartItem } from '@/components/checkout/checkout-summary'

interface Props {
	items: CartItem[]
	id_buyer: string
}

type FormState = 'idle' | 'loading' | 'error'

export default function CheckoutContent({ items, id_buyer }: Props) {
	const router = useRouter()
	const [formState, setFormState] = useState<FormState>('idle')
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const [shippingCost, setShippingCost] = useState<number | null>(null)
	const [shippingDays, setShippingDays] = useState<number | null>(null)
	const [isEstimating, setIsEstimating] = useState(false)

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	function handleZipCodeChange(zip_code: string) {
		if (debounceRef.current)
			clearTimeout(debounceRef.current)

		if (zip_code.length < 4) {
			setShippingCost(null)
			setShippingDays(null)
			setIsEstimating(false)
			return
		}

		setIsEstimating(true)

		debounceRef.current = setTimeout(async () => {
			try {
				const res = await fetch(`/api/shipping/estimate?zip_code=${zip_code}`)
				if (!res.ok) throw new Error()
				const data = await res.json()
				setShippingCost(data.cost ?? null)
				setShippingDays(data.estimated_days ?? null)
			} catch {
				setShippingCost(null)
				setShippingDays(null)
			} finally {
				setIsEstimating(false)
			}
		}, 600)
	}

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
				shipping_cost: shippingCost ?? 0,
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
				onZipCodeChange={handleZipCodeChange}
				isLoading={formState === 'loading'}
				errorMessage={errorMessage}
			/>
			<CheckoutSummary
				items={items}
				shippingCost={shippingCost}
				shippingDays={shippingDays}
				isEstimating={isEstimating}
			/>
		</div>
	)
}
