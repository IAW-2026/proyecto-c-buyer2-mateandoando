import { NextRequest, NextResponse } from 'next/server'
import { shippingService } from '@/services/shipping'

export async function GET(req: NextRequest) {
	const zip_code = req.nextUrl.searchParams.get('zip_code')

	if (!zip_code)
		return NextResponse.json(
			{ error: 'zip_code is required' },
			{ status: 400 }
		)

	const raw = await shippingService.estimateShipping(zip_code)
	console.log('[shipping estimate raw]', JSON.stringify(raw))

	const cost = Number(raw.cost ?? raw.shipping_cost ?? raw.price ?? raw.amount) || null
	const estimated_days = Number(raw.estimated_days ?? raw.days ?? raw.delivery_days ?? raw.business_days) || null

	return NextResponse.json({ cost, estimated_days, zip_code })
}
