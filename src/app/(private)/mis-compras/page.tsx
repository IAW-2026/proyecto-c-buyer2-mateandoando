import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { sellerService } from '@/services/seller'
import EmptyOrders from '@/components/orders/empty-orders'
import OrderRow from '@/components/orders/order-row'
import SearchControls from '@/components/search-controls'
import Pagination from '@/components/pagination'

const PAGE_SIZE = 10

const ORDER_OPTIONS = [
	{ value: 'newest', label: 'Más recientes' },
	{ value: 'oldest', label: 'Más antiguas' },
	{ value: 'price_asc', label: 'Menor precio' },
	{ value: 'price_desc', label: 'Mayor precio' },
]

interface Props {
	searchParams: Promise<{ textQuery?: string; order?: string; page?: string }>
}

export default async function MisComprasPage({ searchParams }: Props) {
	const { userId } = await auth()
	const { textQuery = '', order = '', page = '1' } = await searchParams
	const currentPage = Math.max(1, parseInt(page, 10) || 1)

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

	// fetch orders of the buyer and all products in parallel
	const [allOrders, { items: catalogue }] = await Promise.all([
		db.purchaseOrder.findMany({
			where: { id_buyer: buyer.id_buyer },
			include: {
				packages: {
					include: { items: true },
				},
			},
		}),
		sellerService.getItems(),
	])

	// id_item → product name
	const itemMap: Record<string, string> = Object.fromEntries(
		catalogue.map((item: { id_item: string; name: string }) => [item.id_item, item.name])
	)

	// Enrich each order's package items with the product name
	const enrichedOrders = allOrders.map(order => ({
		...order,
		packages: order.packages.map(pkg => ({
			...pkg,
			items: pkg.items.map(item => ({
				...item,
				product_name: itemMap[item.id_item] ?? 'Producto no disponible',
			})),
		})),
	}))

	// Filter by search query — matches order ID, status, or product name
	const query = textQuery.trim().toLowerCase()
	const filtered = query
		? enrichedOrders.filter(order =>
			order.id_purchase_order.toLowerCase().includes(query) ||
			order.status.toLowerCase().includes(query) ||
			order.packages.some(pkg =>
				pkg.items.some(item => item.product_name.toLowerCase().includes(query))
			)
		)
		: enrichedOrders

	// Sort
	const sorted = [...filtered].sort((a, b) => {
		if (order === 'oldest')     return a.created_at.getTime() - b.created_at.getTime()
		if (order === 'price_asc')  return Number(a.total_price) - Number(b.total_price)
		if (order === 'price_desc') return Number(b.total_price) - Number(a.total_price)
		// default: newest first
		return b.created_at.getTime() - a.created_at.getTime()
	})

	// Paginate
	const totalOrders = sorted.length
	const totalPages  = Math.max(1, Math.ceil(totalOrders / PAGE_SIZE))
	const safePage    = Math.min(currentPage, totalPages)
	const orders      = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

	function buildPageUrl(page: number) {
		const params = new URLSearchParams()
		if (textQuery)
			params.set('textQuery', textQuery)

		if (order)
			params.set('order', order)

		if (page > 1)
			params.set('page', String(page))

		const queryString = params.toString()
		
		return queryString ? `/mis-compras?${queryString}` : '/mis-compras'
	}

	return (
		<>
			<section className="mb-8">
				<h1 className="text-headline-xl font-headline-xl text-primary mb-2">
					Mis Compras
				</h1>
				<p className="text-body-lg font-body-lg text-on-surface-variant">
					Consultá el historial de tus compras.
				</p>
			</section>

			{/* Search + order-by */}
			<div className="mb-8">
				<SearchControls
					key={`${textQuery}-${order}`}
					textQuery={textQuery}
					order={order}
					orderOptions={ORDER_OPTIONS}
					basePath="/mis-compras"
					placeholder="Buscar por producto o estado..."
				/>
			</div>

			{enrichedOrders.length === 0 ? (
				<EmptyOrders />
			) : (
				<>
					{/* Results count */}
					<div className="flex items-center justify-between mb-4">
						<span className="text-label-sm text-on-surface-variant">
							{totalOrders} {totalOrders === 1 ? 'orden' : 'órdenes'}
						</span>
					</div>

					{orders.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
							<p className="text-body-md">No se encontraron órdenes.</p>
							
							{textQuery && (
								<Link href="/mis-compras" className="text-sm text-primary hover:underline">
									Ver todas las compras
								</Link>
							)}
						</div>
					) : (
						<div className="flex flex-col divide-y divide-outline-variant">
							{orders.map(order => (
								<OrderRow
									key={order.id_purchase_order}
									id_purchase_order={order.id_purchase_order}
									created_at={order.created_at}
									total_price={Number(order.total_price)}
									status={order.status}
									packages={order.packages}
								/>
							))}
						</div>
					)}

					{/* Pagination */}
					<Pagination
						currentPage={safePage}
						totalPages={totalPages}
						prevUrl={buildPageUrl(safePage - 1)}
						nextUrl={buildPageUrl(safePage + 1)}
					/>
				</>
			)}
		</>
	)
}
