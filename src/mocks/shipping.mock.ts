type TrackingEvent = {
	date: string
	event: string
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
					date: hoursAgo(48),
					event: 'Paquete retirado por el transportista desde el vendedor.',
				},
				{
					date: hoursAgo(42),
					event: 'En camino al centro de distribución.',
				},
				{
					date: hoursAgo(24),
					event: 'Procesado en el centro de distribución — Buenos Aires.',
				},
				{
					date: hoursAgo(6),
					event: 'Paquete en camino a tu domicilio.',
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
					date: hoursAgo(48),
					event: 'Paquete retirado por el transportista desde el vendedor.',
				},
				{
					date: hoursAgo(28),
					event: 'En tránsito hacia destino.',
				},
				{
					date: hoursAgo(4),
					event: 'Entregado en el domicilio. Recibido por el destinatario.',
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
					date: hoursAgo(3),
					event: 'Paquete retirado por el transportista desde el vendedor.',
				},
			],
		},

		// ─── PENDIENTE — paquete 2 (La Calabaza: Mate de Calabaza) ───────────────
		'seed_pkg_pendiente_2': {
			status: 'RETIRADO',
			carrier_name: 'OCA',
			history: [
				{
					date: hoursAgo(3),
					event: 'Paquete retirado por el transportista desde el vendedor.',
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
					date: hoursAgo(240),
					event: 'Paquete retirado por el transportista desde el vendedor.',
				},
				{
					date: hoursAgo(218),
					event: 'En tránsito hacia destino.',
				},
				{
					date: hoursAgo(200),
					event: 'Pago rechazado. El paquete fue retornado al vendedor.',
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
					date: hoursAgo(492),
					event: 'Paquete retirado por el transportista desde el vendedor.',
				},
				{
					date: hoursAgo(468),
					event: 'En tránsito hacia destino.',
				},
				{
					date: hoursAgo(444),
					event: 'Entregado en el domicilio. Recibido por el destinatario.',
				},
				{
					date: hoursAgo(372),
					event: 'Reembolso aprobado. El paquete fue retornado al vendedor.',
				},
			],
		},

		// ─── REEMBOLSADO — paquete 2 (La Calabaza: Mate de Calabaza) ─────────────
		'seed_pkg_reembolsado_2': {
			status: 'RETORNADO',
			carrier_name: 'Correo Argentino',
			history: [
				{
					date: hoursAgo(492),
					event: 'Paquete retirado por el transportista desde el vendedor.',
				},
				{
					date: hoursAgo(468),
					event: 'En tránsito hacia destino.',
				},
				{
					date: hoursAgo(444),
					event: 'Entregado en el domicilio. Recibido por el destinatario.',
				},
				{
					date: hoursAgo(372),
					event: 'Reembolso aprobado. El paquete fue retornado al vendedor.',
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
