const statusLabel: Record<string, string> = {
	RETIRADO:    'Retirado del vendedor',
	EN_TRANSITO: 'En tránsito',
	ENTREGADO:   'Entregado',
	RETORNADO:   'Retornado',
}

export type TrackingEvent = {
	status: string
	description?: string
	timestamp?: string
}

interface Props {
	history: TrackingEvent[]
}

export default function TrackingHistory({ history }: Props) {
	if (history.length === 0) {
		return (
			<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6">
				<p className="text-body-md text-on-surface-variant">
					Aún no hay eventos de seguimiento registrados.
				</p>
			</div>
		)
	}

	return (
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
			<h2 className="text-headline-md font-headline-md text-on-surface">
				Historial
			</h2>
			<div className="flex flex-col gap-3">
				{history.map((event, index) => (
					<div key={index} className="flex gap-4 items-start">
						<div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
						<div className="flex flex-col gap-0.5">
							<p className="text-body-md text-on-surface font-medium">
								{statusLabel[event.status] ?? event.status}
							</p>
							{event.description && (
								<p className="text-label-sm text-on-surface-variant">{event.description}</p>
							)}
							{event.timestamp && (
								<p className="text-label-sm text-on-surface-variant">
									{new Date(event.timestamp).toLocaleDateString('es-AR', {
										day: '2-digit',
										month: 'long',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
