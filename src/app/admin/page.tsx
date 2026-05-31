import { db } from '@/lib/db'
import StatsCard from '@/components/admin/stats-card'

const STATUS_LABEL: Record<string, string> = {
	PENDIENTE:   'Pendiente',
	APROBADO:    'Aprobado',
	RECHAZADO:   'Rechazado',
	REEMBOLSADO: 'Reembolsado',
}

const STATUS_COLOR: Record<string, string> = {
	PENDIENTE:   'bg-secondary',
	APROBADO:    'bg-primary',
	RECHAZADO:   'bg-error',
	REEMBOLSADO: 'bg-outline',
}

export default async function AdminDashboard() {
	const [
		totalBuyers,
		activeBuyers,
		suspendedBuyers,
		ordersByStatus,
	] = await Promise.all([
		db.buyer.count(),
		db.buyer.count({ where: { status: 'ACTIVO' } }),
		db.buyer.count({ where: { status: 'SUSPENDIDO' } }),
		db.purchaseOrder.groupBy({
			by: ['status'],
			_count: { _all: true },
			orderBy: { _count: { status: 'desc' } },
		}),
	])

	const totalOrders = ordersByStatus.reduce((sum, g) => sum + g._count._all, 0)

	return (
		<>
			<h1 className="text-2xl font-semibold text-on-surface mb-6">Dashboard</h1>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<StatsCard label="Compradores totales" value={totalBuyers} />
				<StatsCard label="Activos" value={activeBuyers} />
				<StatsCard label="Suspendidos" value={suspendedBuyers} />
				<StatsCard label="Órdenes totales" value={totalOrders} />
			</div>

			<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
				<h2 className="text-lg font-semibold text-on-surface mb-6">
					Órdenes por estado
				</h2>

				{totalOrders === 0 ? (
					<p className="text-sm text-on-surface-variant">No hay órdenes registradas aún.</p>
				) : (
					<div className="flex flex-col gap-4">
						{ordersByStatus.map(group => {
							const pct = Math.round((group._count._all / totalOrders) * 100)
							return (
								<div key={group.status} className="flex items-center gap-4">
									<span className="w-28 text-sm text-on-surface-variant flex-shrink-0">
										{STATUS_LABEL[group.status] ?? group.status}
									</span>
									<div className="flex-1 bg-surface-container rounded-full h-2 overflow-hidden">
										<div
											className={`h-2 rounded-full ${STATUS_COLOR[group.status] ?? 'bg-primary'}`}
											style={{ width: `${pct}%` }}
										/>
									</div>
									<span className="text-sm font-semibold text-on-surface w-8 text-right flex-shrink-0">
										{group._count._all}
									</span>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</>
	)
}
