import Link from 'next/link'
import AddToCartButton from '@/components/add-to-cart-button'

interface Props {
	id_item: string
	id_seller: string
	seller_name: string
	name: string
	category_name: string
	price: number | undefined
	discount_pct: number | undefined
	description: string | undefined
}

export default function ProductInfo({
	id_item,
	id_seller,
	seller_name,
	name,
	category_name,
	price,
	discount_pct,
	description,
}: Props) {
	const safePrice = price ?? 0
	const safePct = discount_pct ?? 0
	const hasDiscount = safePct > 0
	const discountedPrice = hasDiscount
		? Math.round(safePrice * (1 - safePct / 100))
		: null

	return (
		<section className="lg:col-span-5 flex flex-col gap-6">

			{/* Badges - TODO: review */}
			<div className="flex gap-2 flex-wrap">
				<span className="bg-surface-container text-on-surface-variant text-label-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
					{category_name}
				</span>
				{hasDiscount && (
					<span className="bg-secondary-container text-on-secondary-container text-label-sm font-semibold px-3 py-1 rounded-full">
						−{discount_pct}% OFF
					</span>
				)}
			</div>

			{/* Name */}
			<h1 className="text-headline-xl font-headline-xl text-primary leading-tight">
				{name}
			</h1>

			{/* Seller */}
			<Link
				href={`/vendedores/${id_seller}`}
				className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
			>
				por <span className="font-semibold">{seller_name}</span>
			</Link>

			{/* Price */}
			<div className="flex items-baseline gap-4">
				{discountedPrice ? (
					<>
						<span className="text-headline-lg font-headline-lg text-primary">
							${discountedPrice.toLocaleString('es-AR')}
						</span>
						<span className="text-body-lg text-on-surface-variant line-through">
							${safePrice.toLocaleString('es-AR')}
						</span>
					</>
				) : (
					<span className="text-headline-lg font-headline-lg text-primary">
						${safePrice.toLocaleString('es-AR')}
					</span>
				)}
			</div>

			{/* Description */}
			<p className="text-body-md font-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant pt-6">
				{description}
			</p>

			{/* Add to cart */}
			<div className="flex flex-col gap-3 pt-2">
				<AddToCartButton id_item={id_item} />

				{/* TODO: Improve this */}
				<div className="flex justify-between items-center px-4 py-3 border border-outline-variant rounded-lg">
					<span className="text-body-sm text-on-surface-variant">
						Envío a todo el país
					</span>
					<span className="text-body-sm text-on-surface-variant">
						Pago seguro
					</span>
				</div>
			</div>

		</section>
	)
}
