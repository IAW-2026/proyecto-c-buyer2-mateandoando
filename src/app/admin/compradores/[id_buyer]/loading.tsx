function SkeletonBlock({ className }: { className: string }) {
	return <div className={`bg-surface-container-high rounded animate-pulse ${className}`} />
}

export default function BuyerDetailLoading() {
	return (
		<>
			{/* Back link */}
			<SkeletonBlock className="h-4 w-28 mb-6" />

			{/* Header */}
			<div className="mb-8">
				<SkeletonBlock className="h-8 w-56 mb-2" />
				<SkeletonBlock className="h-4 w-48" />
			</div>

			{/* Info cards */}
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="bg-surface-container-low border border-outline-variant rounded-xl p-4"
					>
						<SkeletonBlock className="h-3 w-20 mb-2" />
						<SkeletonBlock className="h-6 w-32" />
					</div>
				))}
			</div>

			{/* Order history table */}
			<div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
				<div className="px-6 py-4 border-b border-outline-variant">
					<SkeletonBlock className="h-5 w-44" />
				</div>
				<div className="divide-y divide-outline-variant">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="px-6 py-4 flex gap-8">
							{['w-24', 'w-20', 'w-20', 'w-24'].map((w, j) => (
								<SkeletonBlock key={j} className={`h-4 ${w}`} />
							))}
						</div>
					))}
				</div>
			</div>
		</>
	)
}
