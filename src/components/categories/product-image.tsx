interface Props {
	name: string
}

export default function ProductImage({ name }: Props) {
	return (
		<section className="lg:col-span-7">
			{/* TODO: Search and replace with real images */}
			<div className="overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant aspect-square flex items-center justify-center">
				<span className="text-8xl font-heading font-bold text-outline opacity-30">
					{name[0]}
				</span>
			</div>
		</section>
	)
}
