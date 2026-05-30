import { sellerService } from '@/services/seller'
import SellerCard from '@/components/sellers/seller-card'

export default async function VendedoresPage() {
	const sellers = await sellerService.getSellers()

	return (
		<>
			<section className="mb-8">
				<h1 className="text-headline-xl font-headline-xl text-primary mb-2">
					Vendedores
				</h1>
				<p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
					Conocé a los artesanos y comerciantes que hacen posible MateandoAndo.
				</p>
			</section>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{sellers.map(seller => (
					<SellerCard
						key={seller.id_seller}
						id_seller={seller.id_seller}
						name={seller.name}
						description={seller.description}
					/>
				))}
			</div>
		</>
	)
}
