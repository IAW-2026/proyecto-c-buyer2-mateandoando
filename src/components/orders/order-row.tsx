import Link from 'next/link'
import CancelOrderButton from '@/components/orders/cancel-order-button'

const statusLabel: Record<string, string> = {
	PENDIENTE:   'Pendiente',
	APROBADO:    'Aprobado',
	RECHAZADO:   'Rechazado',
	REEMBOLSADO: 'Reembolsado',
	CANCELADA:   'Cancelada',
}

const statusTextColor: Record<string, string> = {
	PENDIENTE:   'text-secondary',
	APROBADO:    'text-primary',
	RECHAZADO:   'text-error',
	REEMBOLSADO: 'text-on-surface-variant',
	CANCELADA:   'text-on-surface-variant',
}

type OrderPackage = {
	id_package: string
	items: { quantity: number; product_name: string }[]
}

interface Props {
	id_purchase_order: string
	created_at: Date
	total_price: number
	status: string
	checkout_url: string | null
	packages: OrderPackage[]
}

export default function OrderRow({
	id_purchase_order,
	created_at,
	total_price,
	status,
	checkout_url,
	packages,
}: Props) {
	const firstPackageId = packages[0]?.id_package

	const allNames = packages.flatMap(pkg =>
		pkg.items.map(item => item.quantity > 1 ? `${item.product_name} ×${item.quantity}` : item.product_name)
	)

	const displayNames = allNames.slice(0, 2).join(', ')
	const remainder = allNames.length - 2

	return (
		<div className="flex items-center gap-8 py-6">

			{/* Metadata */}
			<div className="flex-grow grid grid-cols-2 sm:grid-cols-5 gap-4">
				<div className="flex flex-col gap-0.5">
					<p className="text-label-sm text-on-surface-variant">Order ID</p>
					<p className="text-body-md font-semibold text-on-surface">
						#{id_purchase_order.slice(0, 8).toUpperCase()}
					</p>
				</div>

				<div className="flex flex-col gap-0.5">
					<p className="text-label-sm text-on-surface-variant">Fecha</p>
					<p className="text-body-md text-on-surface">
						{new Date(created_at).toLocaleDateString('es-AR', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
						})}
					</p>
				</div>

				<div className="flex flex-col gap-0.5">
					<p className="text-label-sm text-on-surface-variant">Productos</p>
					<p className="text-body-sm text-on-surface line-clamp-2">
						{displayNames}{remainder > 0 ? `, +${remainder} más` : ''}
					</p>
				</div>

				<div className="flex flex-col gap-0.5">
					<p className="text-label-sm text-on-surface-variant">Total</p>
					<p className="text-body-md font-semibold text-primary">
						${total_price.toLocaleString('es-AR')}
					</p>
				</div>

				<div className="flex flex-col gap-0.5">
					<p className="text-label-sm text-on-surface-variant">Estado</p>
					<p className={`text-body-md font-medium ${statusTextColor[status] ?? 'text-on-surface'}`}>
						{statusLabel[status] ?? status}
					</p>
				</div>
			</div>

			{/* CTA */}
			<div className="flex flex-col gap-2 flex-shrink-0 w-36">
				{firstPackageId && (
					<Link
						href={`/mis-compras/${firstPackageId}/seguimiento`}
						aria-label={`Ver detalle del pedido #${id_purchase_order.slice(0, 8).toUpperCase()}`}
						className="block text-center w-full border border-outline-variant text-on-surface px-5 py-2 rounded-lg text-body-sm font-medium hover:bg-surface-container transition-colors"
					>
						Ver detalle
					</Link>
				)}
				{(status === 'PENDIENTE' || status === 'RECHAZADO') && checkout_url && (
					<a
						href={checkout_url}
						className="block text-center w-full bg-primary text-on-primary px-5 py-2 rounded-lg text-body-sm font-medium hover:opacity-90 transition-opacity"
					>
						{status === 'PENDIENTE' ? 'Realizar Pago' : 'Reintentar Pago'}
					</a>
				)}
				{status === 'APROBADO' && (
					<CancelOrderButton id_purchase_order={id_purchase_order} status={status} />
				)}
			</div>

		</div>
	)
}
