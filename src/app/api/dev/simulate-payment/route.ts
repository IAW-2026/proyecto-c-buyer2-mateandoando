// Simulates a payment webhook from Payments App

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	if (process.env.NODE_ENV === 'production')
		return new NextResponse(null, { status: 404 })

	const body = await req.json()

	const res = await fetch(
		new URL('/api/buyers/payment-notification', req.url).toString(),
		{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'X-Api-Key': process.env.BUYER_APP_SECRET_KEY ?? '',
			},
			body: JSON.stringify({
				id_purchase_order: body.id_purchase_order ?? '',
				id_payment_operation: body.id_payment_operation ?? 'pay_mock_1',
				status: body.status ?? 'APROBADO',
				payment_hash: body.payment_hash ?? 'mock_hash_' + Date.now(),
			}),
		}
	)

	return NextResponse.json({ forwarded: res.status })
}
