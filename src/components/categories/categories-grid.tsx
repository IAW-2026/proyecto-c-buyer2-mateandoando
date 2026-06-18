import Link from 'next/link'
import ProductCard from '@/components/product-card'

type CategoryItem = {
	id_item: string
	name: string
	description: string
	price: number
	category_name: string
	seller_name: string
	discount_pct: number
	image_url?: string | null
}

interface Props {
	items: CategoryItem[]
	category_name: string
	onlyDiscounted: boolean
}

export default function CategoriesGrid({ items, category_name, onlyDiscounted }: Props) {
	return (
		<div className="flex-grow">
			{items.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
					<p className="text-body-md">
						{onlyDiscounted
							? 'No hay productos con descuento en esta categoría.'
							: 'No hay productos en esta categoría.'
						}
					</p>
					{onlyDiscounted && (
						<Link
							href={`/categorias/${category_name}`}
							className="mt-4 text-primary text-body-sm hover:underline"
						>
							Ver todos los productos
						</Link>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
		</div>
	)
}
