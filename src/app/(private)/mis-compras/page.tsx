import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Package } from 'lucide-react'

const statusLabel: Record<string, string> = {
	PENDIENTE:   'Pendiente',
	APROBADO:    'Aprobado',
	RECHAZADO:   'Rechazado',
	REEMBOLSADO: 'Reembolsado',
}

const statusTextColor: Record<string, string> = {
	PENDIENTE:   'text-on-surface-variant',
	APROBADO:    'text-primary',
	RECHAZADO:   'text-error',
	REEMBOLSADO: 'text-on-surface-variant',
}

export default async function MisComprasPage() {
	const { userId } = await auth()

	const buyer = await db.buyer.findUnique({
		where: { clerk_user_id: userId! },
		select: { id_buyer: true },
	})

	if (!buyer) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
				<p className="text-body-md">Cuenta de comprador no encontrada.</p>
			</div>
		)
	}

	const orders = await db.purchaseOrder.findMany({
		where: { id_buyer: buyer.id_buyer },
		include: {
			packages: {
				include: { items: true },
			},
		},
		orderBy: { created_at: 'desc' },
	})

	// Views
	const emptyOrdersView =
		<div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
			<Package size={48} className="opacity-40" />
			<p className="text-body-md">Todavía no realizaste ninguna compra.</p>
			<Link
				href="/"
				className="bg-primary text-on-primary px-6 py-3 rounded-lg text-body-md font-semibold hover:opacity-90"
			>
				Ver productos
			</Link>
		</div>

	const ordersView =
		<div className="flex flex-col divide-y divide-outline-variant">
			{orders.map(order => {
				const totalQuantity = order.packages.reduce(
					(acc, pkg) => acc + pkg.items.reduce((a, i) => a + i.quantity, 0),
					0
				)
				const firstPackageId = order.packages[0]?.id_package

				return (
					<div key={order.id_purchase_order} className="flex items-center gap-8 py-6">

						{/* Metadata */}
						<div className="flex-grow grid grid-cols-2 sm:grid-cols-5 gap-4">
							<div className="flex flex-col gap-0.5">
								<p className="text-label-sm text-on-surface-variant">Order ID</p>
								<p className="text-body-md font-semibold text-on-surface">
									#{order.id_purchase_order.slice(0, 8).toUpperCase()}
								</p>
							</div>

							<div className="flex flex-col gap-0.5">
								<p className="text-label-sm text-on-surface-variant">Fecha</p>
								<p className="text-body-md text-on-surface">
									{new Date(order.created_at).toLocaleDateString('es-AR', {
										day: '2-digit',
										month: 'short',
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
									${Number(order.total_price).toLocaleString('es-AR')}
								</p>
							</div>

							<div className="flex flex-col gap-0.5">
								<p className="text-label-sm text-on-surface-variant">Estado</p>
								<p className={`text-body-md font-medium ${statusTextColor[order.status]}`}>
									{statusLabel[order.status]}
								</p>
							</div>
						</div>

						{/* Action — vertically centered by parent items-center */}
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
			})}
		</div>

	return (
		<>
			<section className="mb-8">
				<h1 className="text-headline-xl font-headline-xl text-primary mb-2">
					Mis Pedidos
				</h1>
				<p className="text-body-lg font-body-lg text-on-surface-variant">
					Consultá el historial de tus adquisiciones.
				</p>
			</section>

			{orders.length === 0 ? emptyOrdersView : ordersView}
		</>
	)
}
