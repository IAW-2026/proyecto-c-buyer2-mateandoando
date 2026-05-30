import Link from 'next/link'
import { ArrowRight, Store } from 'lucide-react'

interface Props {
	id_seller: string
	name: string
	description: string
}

export default function SellerCard({ id_seller, name, description }: Props) {
	return (
		<Link
			href={`/vendedores/${id_seller}`}
			className="group bg-surface-container-low rounded-xl p-6 border border-outline-variant hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col gap-4"
		>
			{/* Profile image + name */}
			<div className="flex items-center gap-4">
				<div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant flex-shrink-0">
					<Store size={24} className="text-on-surface-variant" />
				</div>
				<h2 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors">
					{name}
				</h2>
			</div>

			{/* Description */}
			<p className="text-body-sm text-on-surface-variant line-clamp-2 flex-grow">
				{description}
			</p>

			{/* CTA */}
			<div className="flex items-center gap-1 text-primary text-label-md font-label-md">
				Ver catálogo
				
				<ArrowRight
					size={16}
					className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-200"
				/>
			</div>
		</Link>
	)
}
