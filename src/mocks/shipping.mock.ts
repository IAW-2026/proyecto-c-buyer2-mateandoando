type TrackingEvent = {
	status: string
	description: string
	timestamp: string
}

type TrackingResult = {
	status: string
	carrier_name: string
	history: TrackingEvent[]
}

function hoursAgo(hours: number): string {
	return new Date(Date.now() - hours * 3_600_000).toISOString()
}

function getTrackingData(id_package: string): TrackingResult {
	const data: Record<string, TrackingResult> = {

		// ─── APROBADO — paquete 1 (El Mateador: Mate Kit + Termo) ────────────────
		// Actualmente en camino al domicilio — historia completa de 4 eventos
		'seed_pkg_aprobado_1': {
			status: 'EN_TRANSITO',
			carrier_name: 'Andreani',
			history: [
				{
					status: 'RETIRADO',
					description: 'Paquete retirado por el transportista desde el vendedor.',
					timestamp: hoursAgo(48),
				},
				{
					status: 'EN_TRANSITO',
					description: 'En camino al centro de distribución.',
					timestamp: hoursAgo(42),
				},
				{
					status: 'EN_TRANSITO',
					description: 'Procesado en el centro de distribución — Buenos Aires.',
					timestamp: hoursAgo(24),
				},
				{
					status: 'EN_TRANSITO',
					description: 'Paquete en camino a tu domicilio.',
					timestamp: hoursAgo(6),
				},
			],
		},

		// ─── APROBADO — paquete 2 (Yerba Buena: Bombilla ×2) ────────────────────
		// Entregado — historia completa de 3 eventos
		'seed_pkg_aprobado_2': {
			status: 'ENTREGADO',
			carrier_name: 'Andreani',
			history: [
				{
					status: 'RETIRADO',
					description: 'Paquete retirado por el transportista desde el vendedor.',
					timestamp: hoursAgo(48),
				},
				{
					status: 'EN_TRANSITO',
					description: 'En tránsito hacia destino.',
					timestamp: hoursAgo(28),
				},
				{
					status: 'ENTREGADO',
					description: 'Entregado en el domicilio. Recibido por el destinatario.',
					timestamp: hoursAgo(4),
				},
			],
		},

		// ─── PENDIENTE — paquete 1 (Yerba Buena: Yerba Taragüi ×2) ──────────────
		// Recién retirado — pago aún no confirmado
		'seed_pkg_pendiente_1': {
			status: 'RETIRADO',
			carrier_name: 'OCA',
			history: [
				{
					status: 'RETIRADO',
					description: 'Paquete retirado por el transportista desde el vendedor.',
					timestamp: hoursAgo(3),
				},
			],
		},

		// ─── PENDIENTE — paquete 2 (La Calabaza: Mate de Calabaza) ───────────────
		'seed_pkg_pendiente_2': {
			status: 'RETIRADO',
			carrier_name: 'OCA',
			history: [
				{
					status: 'RETIRADO',
					description: 'Paquete retirado por el transportista desde el vendedor.',
					timestamp: hoursAgo(3),
				},
			],
		},

		// ─── RECHAZADO — paquete 1 (Yerba Buena: Yerba Amanda ×3) ───────────────
		// Retornado al vendedor por pago rechazado
		'seed_pkg_rechazado_1': {
			status: 'RETORNADO',
			carrier_name: 'Correo Argentino',
			history: [
				{
					status: 'RETIRADO',
					description: 'Paquete retirado por el transportista desde el vendedor.',
					timestamp: hoursAgo(240),
				},
				{
					status: 'EN_TRANSITO',
					description: 'En tránsito hacia destino.',
					timestamp: hoursAgo(218),
				},
				{
					status: 'RETORNADO',
					description: 'Pago rechazado. El paquete fue retornado al vendedor.',
					timestamp: hoursAgo(200),
				},
			],
		},

		// ─── REEMBOLSADO — paquete 1 (El Mateador: Mate Kit) ────────────────────
		// Fue entregado y luego retornado por reembolso aprobado
		'seed_pkg_reembolsado_1': {
			status: 'RETORNADO',
			carrier_name: 'Correo Argentino',
			history: [
				{
					status: 'RETIRADO',
					description: 'Paquete retirado por el transportista desde el vendedor.',
					timestamp: hoursAgo(492),
				},
				{
					status: 'EN_TRANSITO',
					description: 'En tránsito hacia destino.',
					timestamp: hoursAgo(468),
				},
				{
					status: 'ENTREGADO',
					description: 'Entregado en el domicilio. Recibido por el destinatario.',
					timestamp: hoursAgo(444),
				},
				{
					status: 'RETORNADO',
					description: 'Reembolso aprobado. El paquete fue retornado al vendedor.',
					timestamp: hoursAgo(372),
				},
			],
		},

		// ─── REEMBOLSADO — paquete 2 (La Calabaza: Mate de Calabaza) ─────────────
		'seed_pkg_reembolsado_2': {
			status: 'RETORNADO',
			carrier_name: 'Correo Argentino',
			history: [
				{
					status: 'RETIRADO',
					description: 'Paquete retirado por el transportista desde el vendedor.',
					timestamp: hoursAgo(492),
				},
				{
					status: 'EN_TRANSITO',
					description: 'En tránsito hacia destino.',
					timestamp: hoursAgo(468),
				},
				{
					status: 'ENTREGADO',
					description: 'Entregado en el domicilio. Recibido por el destinatario.',
					timestamp: hoursAgo(444),
				},
				{
					status: 'RETORNADO',
					description: 'Reembolso aprobado. El paquete fue retornado al vendedor.',
					timestamp: hoursAgo(372),
				},
			],
		},
	}

	return data[id_package] ?? {
		status: 'EN_TRANSITO',
		carrier_name: 'Mock Carrier',
		history: [],
	}
}

export const shippingMock = {
	async estimateShipping(zip_code: string) {
		return {
			cost: 500,
			estimated_days: 5,
			zip_code,
		}
	},

	async trackPackage(id_package: string) {
		return {
			id_package,
			...getTrackingData(id_package),
		}
	},
}
