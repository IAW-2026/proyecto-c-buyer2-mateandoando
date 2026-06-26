import { notFound } from 'next/navigation'
import { sellerService } from '@/services/seller'
import Breadcrumb from '@/components/breadcrumb'
import ProductImage from '@/components/categories/product-image'
import ProductInfo from '@/components/categories/product-info'

export const dynamic = 'force-dynamic'

interface Props {
	params: Promise<{ category_name: string; id_item: string }>
}

export default async function ProductDetailPage({ params }: Props) {
	const { category_name, id_item } = await params
	const decoded = decodeURIComponent(category_name)
	const item = await sellerService.getItemDetail(decoded, id_item)

	if (!item)
		notFound()

	return (
		<>
			<Breadcrumb items={[
				{ label: 'Inicio', href: '/' },
				{ label: 'Categorías', href: '/categorias' },
				{ label: decoded, href: `/categorias/${category_name}` },
				{ label: item.name },
			]} />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<ProductImage name={item.name} category_name={decoded} image_url={item.image_url} />
                
				<ProductInfo
					id_item={item.id_item}
					id_seller={item.id_seller}
					seller_name={item.seller_name}
					name={item.name}
					category_name={decoded}
					price={item.price}
					discount_pct={item.discount_pct}
					description={item.description}
					rating={item.rating}
					stock={item.stock}
				/>
			</div>
		</>
	)
}
