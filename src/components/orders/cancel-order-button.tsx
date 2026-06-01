'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
	id_purchase_order: string
}

export default function CancelOrderButton({ id_purchase_order }: Props) {
	const router = useRouter()
	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleCancel() {
		const confirmed = window.confirm('¿Estás seguro que querés cancelar esta compra? Se iniciará el reembolso.')
		if (!confirmed) return

		setIsPending(true)
		setError(null)

		try {
			const res = await fetch(`/api/orders/${id_purchase_order}/cancel`, { method: 'POST' })

			if (!res.ok) {
				const data = await res.json()
				setError(data.error ?? 'No se pudo cancelar la compra.')
				setIsPending(false)
				return
			}

			// Keep isPending true — component unmounts once router.refresh() re-fetches
			// the server data and the order is no longer cancellable
			router.refresh()
		} catch {
			setError('Error de conexión. Intentá de nuevo.')
			setIsPending(false)
		}
	}

	return (
		<div className="flex flex-col gap-1">
			<button
				onClick={handleCancel}
				disabled={isPending}
				className="w-full border border-error text-error px-5 py-2 rounded-lg text-body-sm font-medium hover:bg-error hover:text-on-error disabled:opacity-50 transition-colors"
			>
				{isPending ? 'Cancelando...' : 'Cancelar'}
			</button>
			{error && (
				<p className="text-label-sm text-error">{error}</p>
			)}
		</div>
	)
}
