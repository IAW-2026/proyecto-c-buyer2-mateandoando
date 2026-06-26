function SkeletonBlock({ className }: { className: string }) {
	return <div className={`bg-surface-container-high rounded animate-pulse ${className}`} />
}

export default function HomeLoading() {
	return (
		<>
			{/* Welcome section */}
			<section className="mb-8">
				<SkeletonBlock className="h-9 w-72 mb-3" />
				<SkeletonBlock className="h-5 w-[480px]" />
			</section>

			{/* Search + order-by */}
			<div className="mb-8 flex gap-3">
				<SkeletonBlock className="h-11 flex-1 rounded-lg" />
				<SkeletonBlock className="h-11 w-36 rounded-lg" />
			</div>

			{/* Products header */}
			<div className="flex items-center justify-between mb-6">
				<SkeletonBlock className="h-7 w-48" />
				<SkeletonBlock className="h-4 w-24" />
			</div>

			{/* Product card grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{Array.from({ length: 12 }).map((_, i) => (
					<div
						key={i}
						className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden"
					>
						<SkeletonBlock className="h-48 rounded-none" />
						<div className="p-4 flex flex-col gap-3">
							<SkeletonBlock className="h-5 w-3/4" />
							<SkeletonBlock className="h-4 w-full" />
							<SkeletonBlock className="h-4 w-2/3" />
							<SkeletonBlock className="h-6 w-1/3 mt-1" />
						</div>
					</div>
				))}
			</div>
		</>
	)
}
