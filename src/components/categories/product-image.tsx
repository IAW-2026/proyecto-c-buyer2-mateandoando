import Image from 'next/image'
import { getProductImage } from '@/lib/category-images'

interface Props {
	name: string
	category_name: string
}

export default function ProductImage({ name, category_name }: Props) {
	const src = getProductImage(name, category_name)

	return (
		<section className="lg:col-span-7">
			<div className="overflow-hidden rounded-xl border border-outline-variant aspect-square relative bg-surface-container-low">
				{src ? (
					<Image
						src={src}
						alt={name}
						fill
						priority
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 58vw"
					/>
				) : (
					<div
						role="img"
						aria-label={`Imagen de ${name} (sin foto)`}
						className="w-full h-full flex items-center justify-center"
					>
						<span aria-hidden="true" className="text-8xl font-heading font-bold text-outline opacity-30">
							{name[0]}
						</span>
					</div>
				)}
			</div>
		</section>
	)
}
