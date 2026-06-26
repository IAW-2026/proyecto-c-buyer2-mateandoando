interface Props {
	label: string
	value: number | string
}

export default function StatsCard({ label, value }: Props) {
	return (
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-5">
			<p className="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
				{label}
			</p>
			<p className="text-3xl font-bold text-on-surface">
				{typeof value === 'number' ? value.toLocaleString('es-AR') : value}
			</p>
		</div>
	)
}
