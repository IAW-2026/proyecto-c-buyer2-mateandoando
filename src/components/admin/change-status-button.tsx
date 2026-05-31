'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
	id_buyer: string
	currentStatus: string
}

export default function ChangeStatusButton({ id_buyer, currentStatus }: Props) {
	const [isPending, setIsPending] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const isActive = currentStatus === 'ACTIVO'
	const newStatus = isActive ? 'SUSPENDIDO' : 'ACTIVO'
	const actionLabel = isActive ? 'Suspender' : 'Reactivar'

	async function handleClick() {
		if (!confirm(`¿Estás seguro de que querés ${isActive ? 'suspender' : 'reactivar'} este comprador?`)) return

		setIsPending(true)
		setError(null)

		try {
			const res = await fetch(`/api/admin/buyers/${id_buyer}/status`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			})

			if (!res.ok) throw new Error()

			router.refresh()
		} catch {
			setError('No se pudo actualizar el estado. Intentá de nuevo.')
			setIsPending(false)
		}
	}

	return (
		<div className="flex flex-col items-end gap-2">
			<button
				onClick={handleClick}
				disabled={isPending}
				className={`px-4 py-2 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50 ${
					isActive
						? 'bg-error text-on-error hover:opacity-90'
						: 'bg-primary text-on-primary hover:opacity-90'
				}`}
			>
				{isPending ? 'Actualizando...' : actionLabel}
			</button>

			{error && (
				<p className="text-xs text-error">{error}</p>
			)}
		</div>
	)
}
