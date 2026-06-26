import { NextRequest, NextResponse } from 'next/server'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

type NominatimPlace = {
	address?: {
		city?:   string
		town?:   string
		village?: string
		state?:  string
	}
}

export async function GET(req: NextRequest) {
	const cp = req.nextUrl.searchParams.get('cp')?.trim()

	if (!cp)
		return NextResponse.json({ error: 'cp is required' }, { status: 400 })

	const params = new URLSearchParams({
		postalcode: cp,
		country: 'AR',
		format: 'json',
		addressdetails: '1',
		limit: '1',
		'accept-language': 'es',
	})

	let places: NominatimPlace[]

	try {
		const res = await fetch(`${NOMINATIM_URL}?${params}`, {
			headers: {
				// Nominatim requires User-Agent
				'User-Agent': 'MateandoAndo-Buyer-App/1.0',
			},
			next: { revalidate: 86400 }, // cache for 24hs
		})

		if (!res.ok)
			throw new Error(`Nominatim responded ${res.status}`)

		places = await res.json()
	} catch {
		return NextResponse.json(
			{ error: 'Error fetching location data' }, { status: 502 }
		)
	}

	const place = places[0]

	if (!place?.address)
		return NextResponse.json({ error: 'Postal code not found' }, { status: 404 })

	const { address } = place

	// Nominatim can return city, town or village depending on the locality size
	const city = address.city ?? address.town ?? address.village ?? ''
	const province = address.state ?? ''

	if (!city && !province)
		return NextResponse.json({ error: 'Postal code not found' }, { status: 404 })

	return NextResponse.json({ city, province })
}
