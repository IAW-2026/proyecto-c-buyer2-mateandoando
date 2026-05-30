import Link from 'next/link'

const statusLabel: Record<string, string> = {
	PENDIENTE:   'Pendiente',
	APROBADO:    'Aprobado',
	RECHAZADO:   'Rechazado',
	REEMBOLSADO: 'Reembolsado',
}

const statusTextColor: Record<string, string> = {
	PENDIENTE:   'text-secondary',
	APROBADO:    'text-primary',
	RECHAZADO:   'text-error',
	REEMBOLSADO: 'text-on-surface-variant',
}

type OrderPackage = {
	id_package: string
	items: { quantity: number }[]
}

interface Props {
	id_purchase_order: string
	created_at: Date
	total_price: number
	status: string
	packages: OrderPackage[]
}

export default function OrderRow({
	id_purchase_order,
	created_at,
	total_price,
	status,
	packages,
}: Props) {
	const totalQuantity = packages.reduce(
		(acc, pkg) => acc + pkg.items.reduce((a, i) => a + i.quantity, 0),
		0
	)
	const firstPackageId = packages[0]?.id_package

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
					<p className="text-body-md text-on-surface">
						{totalQuantity === 1 ? '1 producto' : `${totalQuantity} productos`}
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
			{firstPackageId ? (
				<Link
					href={`/mis-compras/${firstPackageId}/seguimiento`}
					className="border border-outline-variant text-on-surface px-5 py-2 rounded-lg text-body-sm font-medium hover:bg-surface-container transition-colors flex-shrink-0"
				>
					Ver detalle
				</Link>
			) : (
				<span className="text-label-sm text-on-surface-variant flex-shrink-0">Sin paquetes</span>
			)}

		</div>
	)
}
