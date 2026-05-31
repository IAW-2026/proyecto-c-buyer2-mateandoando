import { db } from '@/lib/db'
import Link from 'next/link'

const PAGE_SIZE = 20

interface Props {
	searchParams: Promise<{ q?: string; page?: string }>
}

export default async function CompradoresPage({ searchParams }: Props) {
	const { q = '', page = '1' } = await searchParams
	const pageNum = Math.max(1, parseInt(page) || 1)

	const where = q
		? {
			OR: [
				{ first_name: { contains: q, mode: 'insensitive' as const } },
				{ last_name: { contains: q, mode: 'insensitive' as const } },
			],
		}
		: {}

	const [buyers, total] = await Promise.all([
		db.buyer.findMany({
			where,
			select: {
				id_buyer: true,
				first_name: true,
				last_name: true,
				status: true,
				created_at: true,
				_count: { select: { purchase_orders: true } },
			},
			orderBy: { created_at: 'desc' },
			skip: (pageNum - 1) * PAGE_SIZE,
			take: PAGE_SIZE,
		}),
		db.buyer.count({ where }),
	])

	const totalPages = Math.ceil(total / PAGE_SIZE)

	function buildHref(overrides: { q?: string; page?: string }) {
		const params = new URLSearchParams()
		const finalQ = 'q' in overrides ? overrides.q : q
		const finalPage = 'page' in overrides ? overrides.page : String(pageNum)
		if (finalQ) params.set('q', finalQ)
		if (finalPage && finalPage !== '1') params.set('page', finalPage)
		const qs = params.toString()
		return `/admin/compradores${qs ? `?${qs}` : ''}`
	}

	return (
		<>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold text-on-surface">Compradores</h1>
				<span className="text-sm text-on-surface-variant">
					{total} {total === 1 ? 'comprador' : 'compradores'}
				</span>
			</div>

			{/* Search */}
			<form method="GET" className="flex gap-3 mb-6">
				<input
					name="q"
					defaultValue={q}
					placeholder="Buscar por nombre..."
					className="flex-1 border border-outline-variant rounded-lg px-4 py-2 text-sm bg-surface text-on-surface focus:outline-none focus:border-primary"
				/>
				<button
					type="submit"
					className="bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
				>
					Buscar
				</button>
				{q && (
					<Link
						href="/admin/compradores"
						className="border border-outline-variant text-sm px-4 py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
					>
						Limpiar
					</Link>
				)}
			</form>

			{/* Table */}
			<div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden mb-6">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-outline-variant text-on-surface-variant text-left">
							<th className="px-6 py-3 font-medium">Nombre</th>
							<th className="px-6 py-3 font-medium">Estado</th>
							<th className="px-6 py-3 font-medium">Órdenes</th>
							<th className="px-6 py-3 font-medium">Registrado</th>
							<th className="px-6 py-3" />
						</tr>
					</thead>
					<tbody className="divide-y divide-outline-variant">
						{buyers.length === 0 ? (
							<tr>
								<td colSpan={5} className="text-center py-12 text-on-surface-variant">
									No se encontraron compradores.
								</td>
							</tr>
						) : buyers.map(buyer => (
							<tr key={buyer.id_buyer} className="hover:bg-surface-container transition-colors">
								<td className="px-6 py-4 font-medium text-on-surface">
									{buyer.first_name} {buyer.last_name}
								</td>
								<td className="px-6 py-4">
									<StatusBadge status={buyer.status} />
								</td>
								<td className="px-6 py-4 text-on-surface-variant">
									{buyer._count.purchase_orders}
								</td>
								<td className="px-6 py-4 text-on-surface-variant">
									{buyer.created_at.toLocaleDateString('es-AR')}
								</td>
								<td className="px-6 py-4 text-right">
									<Link
										href={`/admin/compradores/${buyer.id_buyer}`}
										className="text-primary text-sm font-semibold hover:underline"
									>
										Ver detalle →
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-3">
					{pageNum > 1 ? (
						<Link
							href={buildHref({ page: String(pageNum - 1) })}
							className="px-4 py-2 rounded-lg border border-outline-variant text-sm hover:bg-surface-container transition-colors"
						>
							← Anterior
						</Link>
					) : (
						<span className="px-4 py-2 rounded-lg border border-outline-variant text-sm text-on-surface-variant opacity-40 cursor-not-allowed">
							← Anterior
						</span>
					)}

					<span className="text-sm text-on-surface-variant">
						Página {pageNum} de {totalPages}
					</span>

					{pageNum < totalPages ? (
						<Link
							href={buildHref({ page: String(pageNum + 1) })}
							className="px-4 py-2 rounded-lg border border-outline-variant text-sm hover:bg-surface-container transition-colors"
						>
							Siguiente →
						</Link>
					) : (
						<span className="px-4 py-2 rounded-lg border border-outline-variant text-sm text-on-surface-variant opacity-40 cursor-not-allowed">
							Siguiente →
						</span>
					)}
				</div>
			)}
		</>
	)
}

function StatusBadge({ status }: { status: string }) {
	const isActive = status === 'ACTIVO'
	return (
		<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
			isActive
				? 'bg-primary-container text-on-primary-container'
				: 'bg-error-container text-on-error-container'
		}`}>
			{status}
		</span>
	)
}
