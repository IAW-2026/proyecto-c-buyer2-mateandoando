import { Truck } from 'lucide-react'

const statusLabel: Record<string, string> = {
	PENDIENTE:   'Pendiente',
	PREPARADO:   'Preparando envío',
	DESPACHADO:  'Despachado por el vendedor',
	EN_TRANSITO: 'En tránsito',
	ENTREGADO:   'Entregado',
	RETORNADO:   'Retornado',
	CANCELADA:   'Cancelado',
}

const statusColor: Record<string, string> = {
	PENDIENTE:   'text-on-surface-variant',
	PREPARADO:   'text-secondary',
	DESPACHADO:  'text-secondary',
	EN_TRANSITO: 'text-secondary',
	ENTREGADO:   'text-primary',
	RETORNADO:   'text-error',
	CANCELADA:   'text-error',
}

interface Props {
	status: string
	carrier_name?: string
}

export default function TrackingStatusCard({ status, carrier_name }: Props) {
	return (
		<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<Truck size={24} className="text-primary" />
				<div>
					<p className="text-label-sm text-on-surface-variant">Estado actual</p>
					<p className={`text-headline-md font-headline-md ${statusColor[status] ?? 'text-on-surface'}`}>
						{statusLabel[status] ?? status}
					</p>
				</div>
			</div>

			{carrier_name && (
				<p className="text-body-md text-on-surface-variant border-t border-outline-variant pt-4">
					Transportista: <span className="text-on-surface font-medium">{carrier_name}</span>
				</p>
			)}
		</div>
	)
}
