import Link from 'next/link'
import { sellerService } from '@/services/seller'
import ProductCard from '@/components/product-card'
import SearchControls from '@/components/search-controls'
import Pagination from '@/components/pagination'

const PAGE_SIZE = 12

interface Props {
	searchParams: Promise<{ textQuery?: string; order?: string; page?: string }>
}

export default async function HomePage({ searchParams }: Props) {
	const { textQuery = '', order = '', page = '1' } = await searchParams
	const currentPage = Math.max(1, parseInt(page, 10) || 1)

	const { items: allItems } = await sellerService.getItems()

	// Filter by search query
	const query = textQuery.trim().toLowerCase()
	const filtered = query
		? allItems.filter(i =>
			i.name.toLowerCase().includes(query) ||
			i.description.toLowerCase().includes(query)
		)
		: allItems

	// Sort by effective price (after discount)
	const effectivePrice = (item: (typeof allItems)[0]) =>
		item.discount_pct > 0
			? Math.round(item.price * (1 - item.discount_pct / 100))
			: item.price

	const sorted = [...filtered].sort((a, b) => {
		if (order === 'price_asc') return effectivePrice(a) - effectivePrice(b)
		if (order === 'price_desc') return effectivePrice(b) - effectivePrice(a)
		return 0
	})

	// Paginate
	const totalItems = sorted.length
	const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
	const safePage = Math.min(currentPage, totalPages) // prevents something like page=99 where the number of pages is lower than 99
	const items = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

	function buildPageUrl(p: number) {
		const params = new URLSearchParams()
		if (textQuery)
			params.set('textQuery', textQuery)

		if (order)
			params.set('order', order)

		if (p > 1)
			params.set('page', String(p))
		const qs = params.toString()

		return qs ? `/?${qs}` : '/'
	}

	return (
		<>
			{/* Welcome */}
			<section className="mb-8">
				<h1 className="text-headline-xl font-headline-xl text-primary mb-2">
					Bienvenido a MateandoAndo
				</h1>
				<p className="text-body-lg font-body-lg text-on-surface-variant">
					Descubrí los mejores productos artesanales de mate. Kits, termos, yerbas y accesorios seleccionados por vendedores de confianza.
				</p>
			</section>

			{/* Search + order-by */}
			<div className="mb-8">
				<SearchControls key={`${textQuery}-${order}`} textQuery={textQuery} order={order} basePath="/" />
			</div>

			{/* Products */}
			<section>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-headline-md font-headline-md text-on-surface">
						{textQuery ? `Resultados para "${textQuery}"` : 'Todos los productos'}
					</h2>
					<span className="text-label-sm text-on-surface-variant">
						{totalItems} {totalItems === 1 ? 'producto' : 'productos'}
					</span>
				</div>

				{items.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
						<p className="text-body-md">No se encontraron productos.</p>
						{textQuery && (
							<Link href="/" className="text-sm text-primary hover:underline">
								Ver todos los productos
							</Link>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{items.map((item) => (
							<ProductCard
								key={item.id_item}
								id_item={item.id_item}
								name={item.name}
								description={item.description}
								price={item.price}
								category_name={item.category_name}
								seller_name={item.seller_name}
								discount_pct={item.discount_pct}
								image_url={item.image_url}
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
			</section>
		</>
	)
}
