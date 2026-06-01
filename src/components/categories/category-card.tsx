import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Props {
	category_name: string
	item_count: number
}

export default function CategoryCard({ category_name, item_count }: Props) {
	return (
		<Link
			href={`/categorias/${encodeURIComponent(category_name)}`}
			className="group flex flex-col cursor-pointer"
		>
			{/* Image placeholder */}
			<div className="relative overflow-hidden rounded-xl border border-outline-variant aspect-[4/5] bg-surface-container flex items-center justify-center border border-outline-variant hover:border-primary hover:shadow-md transition-all duration-200">
				<span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">
					{category_name[0]}
				</span>
			</div>

			{/* Label */}
			<div className="mt-3 flex justify-between items-center">
				<h2 className="text-headline-md font-headline-md text-on-surface">
					{category_name}
				</h2>
				<ArrowRight size={20} aria-hidden="true" className="text-primary" />
			</div>

			<p className="text-body-sm text-on-surface-variant">
				{item_count} {item_count === 1 ? 'producto' : 'productos'}
			</p>
		</Link>
	)
}
