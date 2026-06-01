function SkeletonBlock({ className }: { className: string }) {
	return <div className={`bg-surface-container-high rounded animate-pulse ${className}`} />
}

export default function AdminLoading() {
	return (
		<>
			{/* Header */}
			<div className="mb-8">
				<SkeletonBlock className="h-8 w-72 mb-2" />
				<SkeletonBlock className="h-5 w-48" />
			</div>

			{/* Stat cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="bg-surface-container-low border border-outline-variant rounded-xl p-4"
					>
						<SkeletonBlock className="h-3 w-20 mb-4" />
						<SkeletonBlock className="h-8 w-24" />
					</div>
				))}
			</div>

			{/* Chart */}
			<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
				<SkeletonBlock className="h-5 w-52 mb-6" />
				<div className="flex items-end gap-3 h-48">
					{Array.from({ length: 4 }).map((_, i) => (
						<SkeletonBlock
							key={i}
							className={`flex-1 rounded-t ${['h-3/4', 'h-1/2', 'h-1/4', 'h-full'][i]}`}
						/>
					))}
				</div>
			</div>
		</>
	)
}
