import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getProductImage } from '@/lib/category-images'

interface Props {
	id_item: string
	name: string
	description: string
	price: number
	category_name: string
	seller_name: string
	discount_pct: number
	image_url?: string | null
}

export default function ProductCard({
	id_item,
	name,
	description,
	price,
	category_name,
	seller_name,
	discount_pct,
	image_url,
}: Props) {
	const hasDiscount = discount_pct > 0
	const discountedPrice = hasDiscount ? Math.round(price * (1 - discount_pct / 100)) : null
	const detailHref = `/categorias/${encodeURIComponent(category_name)}/${id_item}`
	const src = getProductImage(name, category_name, image_url)

	return (
		<Link
			href={detailHref}
			className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 border border-outline-variant hover:border-primary hover:shadow-md"
		>
			{/* Image */}
			<div className="relative aspect-video overflow-hidden bg-surface-container">
				{src ? (
					<Image
						src={src}
						alt={name}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-500"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<div
						role="img"
						aria-label={`Imagen de ${name} (sin foto)`}
						className="w-full h-full bg-surface-container-high flex items-center justify-center group-hover:scale-105 transition-transform duration-500"
					>
						<span aria-hidden="true" className="text-4xl font-bold text-outline opacity-30">
							{name[0]}
						</span>
					</div>
				)}

				{hasDiscount && (
					<span className="absolute top-2 right-2 bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold px-2 py-0.5 rounded-full">
						−{discount_pct}%
					</span>
				)}
			</div>

			{/* Content */}
			<div className="p-4 flex flex-col flex-grow">
				<h3 className="text-body-md font-bold text-on-surface mb-1 line-clamp-1">{name}</h3>
				<p className="text-label-sm text-on-surface-variant mb-1">{seller_name}</p>
				<p className="text-label-sm text-on-surface-variant mb-4 line-clamp-2">{description}</p>

				<div className="mt-auto flex justify-between items-center">
					<div className="flex flex-col">
						{discountedPrice ? (
							<>
								<span className="text-body-md font-bold text-primary-container">
									${discountedPrice.toLocaleString('es-AR')}
								</span>
								<span className="text-label-sm text-on-surface-variant line-through">
									${price.toLocaleString('es-AR')}
								</span>
							</>
						) : (
							<span className="text-body-md font-bold text-primary-container">
								${price.toLocaleString('es-AR')}
							</span>
						)}
					</div>
					<ArrowRight size={18} aria-hidden="true" className="text-primary flex-shrink-0" />
				</div>
			</div>
		</Link>
	)
}
