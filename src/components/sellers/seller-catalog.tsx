import ProductCard from '@/components/product-card'

type SellerItem = {
	id_item: string
	name: string
	description: string
	price: number
	category_name: string
	discount_pct: number
	image_url?: string | null
}

interface Props {
	items: SellerItem[]
	seller_name: string
}

export default function SellerCatalog({ items, seller_name }: Props) {
	return (
		<section>
			<h2 className="text-headline-md font-headline-md text-on-surface mb-6">
				Catálogo
			</h2>

			{items.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
					<p className="text-body-md">Este vendedor no tiene productos todavía.</p>
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
							seller_name={seller_name}
							discount_pct={item.discount_pct}
							image_url={item.image_url}
						/>
					))}
				</div>
			)}
		</section>
	)
}
