function SkeletonBlock({ className }: { className: string }) {
	return <div className={`bg-surface-container-high rounded animate-pulse ${className}`} />
}

export default function CompradoresLoading() {
	return (
		<>
			{/* Header + search row */}
			<div className="flex items-center justify-between gap-4 mb-6">
				<SkeletonBlock className="h-8 w-44" />
				<SkeletonBlock className="h-10 w-64 rounded-lg" />
			</div>

			{/* Table */}
			<div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden">
				{/* Table header */}
				<div className="px-6 py-3 border-b border-outline-variant flex gap-6">
					{['w-36', 'w-52', 'w-28', 'w-20', 'w-28'].map((w, i) => (
						<SkeletonBlock key={i} className={`h-4 ${w}`} />
					))}
				</div>

				{/* Table rows */}
				<div className="divide-y divide-outline-variant">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="px-6 py-4 flex gap-6 items-center">
							{['w-36', 'w-52', 'w-28', 'w-20', 'w-28'].map((w, j) => (
								<SkeletonBlock key={j} className={`h-4 ${w}`} />
							))}
						</div>
					))}
				</div>
			</div>
		</>
	)
}
