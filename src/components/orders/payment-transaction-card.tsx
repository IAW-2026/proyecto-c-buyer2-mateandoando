import { CreditCard } from 'lucide-react'

// These field names come directly from the Payments App API response (camelCase)
export type PaymentTransaction = {
	idPaymentOperation: string
	idPurchaseOrder: string
	totalPrice: number
	status: string
	url: string | null
	paymentHash: string | null
	createdAt: string
	updatedAt: string
}

const statusLabel: Record<string, string> = {
	PENDIENTE:   'Pendiente de pago',
	APROBADO:    'Pago aprobado',
	RECHAZADO:   'Pago rechazado',
	REEMBOLSADO: 'Reembolso procesado',
	CANCELADO:   'Cancelado',
}

const statusColor: Record<string, string> = {
	PENDIENTE:   'text-secondary',
	APROBADO:    'text-primary',
	RECHAZADO:   'text-error',
	REEMBOLSADO: 'text-on-surface-variant',
	CANCELADO:   'text-on-surface-variant',
}

interface Props {
	transaction: PaymentTransaction
}

export default function PaymentTransactionCard({ transaction }: Props) {
	const { status, totalPrice, paymentHash, updatedAt } = transaction

	return (
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<CreditCard size={24} className="text-primary" />

				<h2 className="text-label-lg font-medium text-on-surface">
					Transacción
				</h2>
			</div>

			<div className="flex flex-col gap-3 text-body-md">
				<div className="flex justify-between">
					<span className="text-on-surface-variant">
						Estado del pago
					</span>

					<span className={`font-medium ${statusColor[status] ?? 'text-on-surface'}`}>
						{statusLabel[status] ?? status}
					</span>
				</div>

				<div className="flex justify-between">
					<span className="text-on-surface-variant">Total cobrado</span>
					<span className="font-semibold text-on-surface">
						${Number(totalPrice).toLocaleString('es-AR')}
					</span>
				</div>

				<div className="flex justify-between">
					<span className="text-on-surface-variant">Última actualización</span>
					<span className="text-on-surface">
						{new Date(updatedAt).toLocaleDateString('es-AR', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
						})}
					</span>
				</div>

				{paymentHash && (
					<div className="flex flex-col gap-1 border-t border-outline-variant pt-3">
						<span className="text-on-surface-variant">
							Referencia de pago
						</span>
						
						<span className="text-body-sm text-on-surface font-mono break-all">
							{paymentHash}
						</span>
					</div>
				)}
			</div>
		</div>
	)
}
