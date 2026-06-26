function SkeletonBlock({ className }: { className: string }) {
	return <div className={`bg-surface-container-high rounded animate-pulse ${className}`} />
}

export default function MisComprasLoading() {
	return (
		<>
			{/* Header */}
			<section className="mb-8">
				<SkeletonBlock className="h-9 w-44 mb-3" />
				<SkeletonBlock className="h-5 w-72" />
			</section>

			{/* Search + order-by */}
			<div className="mb-8 flex gap-3">
				<SkeletonBlock className="h-11 flex-1 rounded-lg" />
				<SkeletonBlock className="h-11 w-44 rounded-lg" />
			</div>

			{/* Results count */}
			<SkeletonBlock className="h-4 w-24 mb-4" />

			{/* Order rows */}
			<div className="flex flex-col divide-y divide-outline-variant">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex items-center gap-8 py-6">
						<div className="flex-grow grid grid-cols-2 sm:grid-cols-5 gap-4">
							{Array.from({ length: 5 }).map((_, j) => (
								<div key={j} className="flex flex-col gap-1.5">
									<SkeletonBlock className="h-3 w-16" />
									<SkeletonBlock className="h-5 w-24" />
								</div>
							))}
						</div>
						<div className="flex-shrink-0 w-36">
							<SkeletonBlock className="h-9 rounded-lg" />
						</div>
					</div>
				))}
			</div>
		</>
	)
}
