import { notFound } from 'next/navigation'
import { sellerService } from '@/services/seller'
import Breadcrumb from '@/components/breadcrumb'
import SellerPresentationCard from '@/components/sellers/seller-presentation-card'
import SellerCatalog from '@/components/sellers/seller-catalog'

export const dynamic = 'force-dynamic'

interface Props {
	params: Promise<{ id_seller: string }>
}

export default async function SellerProfilePage({ params }: Props) {
	const { id_seller } = await params
	const seller = await sellerService.getSellerById(id_seller)

	if (!seller) notFound()

	return (
		<>
			<Breadcrumb items={[
				{ label: 'Inicio', href: '/' },
				{ label: 'Vendedores', href: '/vendedores' },
				{ label: seller.name },
			]} />

			<SellerPresentationCard
				name={seller.name}
				description={seller.description}
				item_count={seller.items.length}
				rating={seller.rating}
			/>

			<SellerCatalog
				items={seller.items}
				seller_name={seller.name}
			/>
		</>
	)
}
