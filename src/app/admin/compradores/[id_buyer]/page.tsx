import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'

interface Props {
	params: Promise<{ id_buyer: string }>
}

const ORDER_STATUS_STYLE: Record<string, string> = {
	PENDIENTE:   'bg-secondary-container text-on-secondary-container',
	APROBADO:    'bg-primary-container text-on-primary-container',
	RECHAZADO:   'bg-error-container text-on-error-container',
	REEMBOLSADO: 'bg-surface-container-high text-on-surface',
}

export default async function BuyerDetailPage({ params }: Props) {
	const { id_buyer } = await params

	const buyer = await db.buyer.findUnique({
		where: { id_buyer },
		include: {
			purchase_orders: {
				orderBy: { created_at: 'desc' },
				take: 50,
			},
		},
	})

	if (!buyer) notFound()

	let email = ''
	try {
		const client = await clerkClient()
		const user = await client.users.getUser(buyer.clerk_user_id)
		email = user.primaryEmailAddress?.emailAddress ?? ''
	} catch {
		// Clerk user not found or API error — email stays empty
	}

	const totalSpent = buyer.purchase_orders
		.filter(o => o.status === 'APROBADO')
		.reduce((sum, o) => sum + Number(o.total_price), 0)

	return (
		<>
			{/* Back */}
			<div className="mb-6">
				<Link
					href="/admin/compradores"
					className="text-sm text-on-surface-variant hover:text-primary transition-colors"
				>
					← Compradores
				</Link>
			</div>

			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-on-surface">
					{buyer.first_name} {buyer.last_name}
				</h1>
				{email && (
					<p className="text-sm text-on-surface-variant mt-1 break-all">{email}</p>
				)}
			</div>

			{/* Info cards */}
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
				<InfoCard label="Registrado">
					{buyer.created_at.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
				</InfoCard>
				<InfoCard label="Órdenes">
					{buyer.purchase_orders.length}
				</InfoCard>
				<InfoCard label="Total aprobado" className="col-span-2 lg:col-span-1">
					${totalSpent.toLocaleString('es-AR')}
				</InfoCard>
			</div>

			{/* Order history */}
			<div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
				<div className="px-4 md:px-6 py-4 border-b border-outline-variant">
					<h2 className="font-semibold text-on-surface">Historial de órdenes</h2>
				</div>

				{buyer.purchase_orders.length === 0 ? (
					<p className="text-center py-10 text-on-surface-variant text-sm">
						Sin órdenes registradas.
					</p>
				) : (
					<>
						{/* ── Mobile card list ──────────────────────── */}
						<ul className="md:hidden divide-y divide-outline-variant">
							{buyer.purchase_orders.map(order => (
								<li key={order.id_purchase_order} className="flex items-center justify-between gap-3 px-4 py-3">
									<div>
										<p className="font-mono text-xs text-on-surface-variant mb-1">
											#{order.id_purchase_order.slice(0, 8).toUpperCase()}
										</p>
										<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_STYLE[order.status] ?? 'bg-surface-container text-on-surface'}`}>
											{order.status}
										</span>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold text-on-surface">
											${Number(order.total_price).toLocaleString('es-AR')}
										</p>
										<p className="text-xs text-on-surface-variant mt-0.5">
											{order.created_at.toLocaleDateString('es-AR')}
										</p>
									</div>
								</li>
							))}
						</ul>

						{/* ── Desktop table ─────────────────────────── */}
						<table className="hidden md:table w-full text-sm">
							<thead>
								<tr className="border-b border-outline-variant text-on-surface-variant text-left">
									<th className="px-6 py-3 font-medium">ID</th>
									<th className="px-6 py-3 font-medium">Estado</th>
									<th className="px-6 py-3 font-medium">Total</th>
									<th className="px-6 py-3 font-medium">Fecha</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-outline-variant">
								{buyer.purchase_orders.map(order => (
									<tr key={order.id_purchase_order} className="hover:bg-surface-container transition-colors">
										<td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
											#{order.id_purchase_order.slice(0, 8).toUpperCase()}
										</td>
										<td className="px-6 py-4">
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_STYLE[order.status] ?? 'bg-surface-container text-on-surface'}`}>
												{order.status}
											</span>
										</td>
										<td className="px-6 py-4 text-on-surface font-semibold">
											${Number(order.total_price).toLocaleString('es-AR')}
										</td>
										<td className="px-6 py-4 text-on-surface-variant">
											{order.created_at.toLocaleDateString('es-AR')}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				)}
			</div>
		</>
	)
}

function InfoCard({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
	return (
		<div className={`bg-surface-container-low border border-outline-variant rounded-xl p-4 ${className}`}>
			<p className="text-xs text-on-surface-variant mb-1">{label}</p>
			<div className="text-on-surface font-semibold text-sm md:text-base">{children}</div>
		</div>
	)
}
