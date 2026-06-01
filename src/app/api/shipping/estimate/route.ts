import { NextRequest, NextResponse } from 'next/server'
import { shippingService } from '@/services/shipping'

export async function GET(req: NextRequest) {
	const zip_code = req.nextUrl.searchParams.get('zip_code')

	if (!zip_code)
		return NextResponse.json(
			{ error: 'zip_code is required' },
			{ status: 400 }
		)

	const estimate = await shippingService.estimateShipping(zip_code)
	
	return NextResponse.json(estimate)
}
