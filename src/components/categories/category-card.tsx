import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getProductImage } from '@/lib/category-images'

interface Props {
	name: string | undefined
	item_count: number | undefined
}

export default function CategoryCard({ name, item_count }: Props) {
	const src = getProductImage(name, name)

	return (
		<Link
			href={`/categorias/${encodeURIComponent(name ?? '')}`}
			className="group flex flex-col cursor-pointer"
		>
			{/* Image */}
			<div className="relative overflow-hidden rounded-xl border border-outline-variant aspect-[4/5] bg-surface-container hover:border-primary hover:shadow-md transition-all duration-200">
				{src ? (
					<Image
						src={src}
						alt={name ?? ''}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
						sizes="(max-width: 640px) 50vw, 25vw"
					/>
				) : (
					<div
						role="img"
						aria-label={`Imagen de ${name} (sin foto)`}
						className="w-full h-full flex items-center justify-center"
					>
						<span aria-hidden="true" className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">
							{name?.[0] ?? '?'}
						</span>
					</div>
				)}
			</div>

			{/* Label */}
			<div className="mt-3 flex justify-between items-center">
				<h2 className="text-headline-md font-headline-md text-on-surface">
					{name}
				</h2>
				<ArrowRight size={20} aria-hidden="true" className="text-primary" />
			</div>

			<p className="text-body-sm text-on-surface-variant">
				{item_count ?? 0} {item_count === 1 ? 'producto' : 'productos'}
			</p>
		</Link>
	)
}
