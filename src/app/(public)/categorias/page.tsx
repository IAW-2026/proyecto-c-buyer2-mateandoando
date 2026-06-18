import { sellerService } from '@/services/seller'
import CategoryCard from '@/components/categories/category-card'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
	const categories = await sellerService.getCategories()

	return (
		<>
			<section className="mb-8">
				<h1 className="text-headline-xl font-headline-xl text-primary mb-2">
					Explorar Categorías
				</h1>
				<p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
					Descubrí nuestra selección de productos artesanales, elaborados con materiales sostenibles y técnicas tradicionales.
				</p>
			</section>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{categories.map((cat) => (
					<CategoryCard
						key={cat.name}
						name={cat.name}
						item_count={cat.item_count}
					/>
				))}
			</div>
		</>
	)
}
