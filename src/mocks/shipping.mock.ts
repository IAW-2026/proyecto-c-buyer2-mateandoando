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

// Keyed by the base seed package name (without buyer prefix).
// trackPackage() strips any buyer prefix before looking up here.
const TRACKING_DATA: Record<string, TrackingResult> = {

	// ── APROBADO 1 (3 días, CABA) ─────────────────────────────────────────────

	// El Mateador: Mate Kit Premium + Termo Stanley 1L — aún en camino
	'seed_pkg_aprobado_1a': {
		status: 'EN_TRANSITO',
		carrier_name: 'Andreani',
		history: [
			{ date: hoursAgo(72), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(60), event: 'En camino al centro de distribución.' },
			{ date: hoursAgo(36), event: 'Procesado en centro de distribución — Buenos Aires.' },
			{ date: hoursAgo(6),  event: 'Paquete en camino a tu domicilio.' },
		],
	},

	// Yerba Buena Shop: Bombilla de Alpaca ×2 — entregado
	'seed_pkg_aprobado_1b': {
		status: 'ENTREGADO',
		carrier_name: 'Andreani',
		history: [
			{ date: hoursAgo(72), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(55), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(40), event: 'Entregado en el domicilio. Recibido por el destinatario.' },
		],
	},

	// ── APROBADO 2 (8 días, Córdoba) ─────────────────────────────────────────

	// El Mateador: Termo Cebador 1.5L + Kit Viajero — entregado
	'seed_pkg_aprobado_2a': {
		status: 'ENTREGADO',
		carrier_name: 'OCA',
		history: [
			{ date: hoursAgo(192), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(168), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(144), event: 'Procesado en centro de distribución — Córdoba.' },
			{ date: hoursAgo(120), event: 'Entregado en el domicilio. Recibido por el destinatario.' },
		],
	},

	// La Calabaza: Mate de Madera Lapacho — entregado
	'seed_pkg_aprobado_2b': {
		status: 'ENTREGADO',
		carrier_name: 'OCA',
		history: [
			{ date: hoursAgo(192), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(170), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(145), event: 'Entregado en el domicilio. Recibido por el destinatario.' },
		],
	},

	// ── RECHAZADO 1 (12 días, Rosario) ───────────────────────────────────────

	// Yerba Buena Shop: Yerba Amanda ×3 — retornado por pago rechazado
	'seed_pkg_rechazado_1a': {
		status: 'RETORNADO',
		carrier_name: 'Correo Argentino',
		history: [
			{ date: hoursAgo(288), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(264), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(240), event: 'Pago rechazado. El paquete fue retornado al vendedor.' },
		],
	},

	// ── RECHAZADO 2 (18 días, Mendoza) ───────────────────────────────────────

	// El Mateador: Kit Gaucho Completo — retornado
	'seed_pkg_rechazado_2a': {
		status: 'RETORNADO',
		carrier_name: 'Correo Argentino',
		history: [
			{ date: hoursAgo(432), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(408), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(384), event: 'Pago rechazado. El paquete fue retornado al vendedor.' },
		],
	},

	// Yerba Buena Shop: Yerba CBSé ×2 — retornado
	'seed_pkg_rechazado_2b': {
		status: 'RETORNADO',
		carrier_name: 'Correo Argentino',
		history: [
			{ date: hoursAgo(432), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(410), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(386), event: 'Pago rechazado. El paquete fue retornado al vendedor.' },
		],
	},

	// ── REEMBOLSADO 1 (22 días, Tucumán) ─────────────────────────────────────

	// El Mateador: Mate Kit Premium + Termo Stanley XL — entregado y luego devuelto
	'seed_pkg_reembolsado_1a': {
		status: 'RETORNADO',
		carrier_name: 'Andreani',
		history: [
			{ date: hoursAgo(528), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(504), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(480), event: 'Entregado en el domicilio. Recibido por el destinatario.' },
			{ date: hoursAgo(432), event: 'Reembolso aprobado. El paquete fue retornado al vendedor.' },
		],
	},

	// La Calabaza: Mate de Calabaza — entregado y luego devuelto
	'seed_pkg_reembolsado_1b': {
		status: 'RETORNADO',
		carrier_name: 'Andreani',
		history: [
			{ date: hoursAgo(528), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(500), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(476), event: 'Entregado en el domicilio. Recibido por el destinatario.' },
			{ date: hoursAgo(430), event: 'Reembolso aprobado. El paquete fue retornado al vendedor.' },
		],
	},

	// ── REEMBOLSADO 2 (35 días, La Plata) ────────────────────────────────────

	// El Mateador: Kit Estancia Premium — entregado y luego devuelto
	'seed_pkg_reembolsado_2a': {
		status: 'RETORNADO',
		carrier_name: 'Correo Argentino',
		history: [
			{ date: hoursAgo(840), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(816), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(792), event: 'Entregado en el domicilio. Recibido por el destinatario.' },
			{ date: hoursAgo(720), event: 'Reembolso aprobado. El paquete fue retornado al vendedor.' },
		],
	},

	// La Calabaza: Portamate de Cuero — entregado y luego devuelto
	'seed_pkg_reembolsado_2b': {
		status: 'RETORNADO',
		carrier_name: 'Correo Argentino',
		history: [
			{ date: hoursAgo(840), event: 'Paquete retirado por el transportista desde el vendedor.' },
			{ date: hoursAgo(818), event: 'En tránsito hacia destino.' },
			{ date: hoursAgo(795), event: 'Entregado en el domicilio. Recibido por el destinatario.' },
			{ date: hoursAgo(722), event: 'Reembolso aprobado. El paquete fue retornado al vendedor.' },
		],
	},
}

/**
 * Seed packages are stored with a buyer-specific prefix to avoid DB collisions
 * between users (e.g. "a1b2c3d4_seed_pkg_aprobado_1a").
 * Strip everything before the first "seed_pkg_" occurrence to find the base key.
 */
function getTrackingData(id_package: string): TrackingResult {
	const seedIdx = id_package.indexOf('seed_pkg_')
	const key = seedIdx !== -1 ? id_package.slice(seedIdx) : id_package

	return TRACKING_DATA[key] ?? {
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
