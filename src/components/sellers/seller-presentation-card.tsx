import { Store } from 'lucide-react'

interface Props {
	name: string
	description: string
	item_count: number
	rating?: number | null
}

export default function SellerPresentationCard({ name, description, item_count, rating }: Props) {
	return (
		<section className="bg-surface-container-low rounded-xl border border-outline-variant p-8 mb-10 flex flex-col sm:flex-row gap-6 items-start">

			{/* Avatar */}
			<div className="w-20 h-20 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center flex-shrink-0">
				<Store size={36} className="text-on-surface-variant" />
			</div>

			{/* Info */}
			<div className="flex flex-col gap-3 flex-grow">
				<h1 className="text-headline-lg font-headline-lg text-primary">
					{name}
				</h1>
				<p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
					{description}
				</p>
				<div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
					<span className="bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
						{item_count} {item_count === 1 ? 'producto' : 'productos'}
					</span>
					{rating != null && (
						<span className="bg-surface-container px-3 py-1 rounded-full border border-outline-variant text-amber-500 font-medium">
							★ {rating.toFixed(1)}
						</span>
					)}
				</div>
			</div>

		</section>
	)
}
