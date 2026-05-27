// Simulates the payment webhook

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return new NextResponse(null, { status: 404 })
    }
    
    const body = await req.json()
    const notificationEndpoint = "/api/buyers/payment-notification"
    
    const notificationRes = await fetch(
        new URL(notificationEndpoint, req.url).toString(),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Service-Token': process.env.X_SERVICE_TOKEN_PAYMENTS ?? '',
            },
            body: JSON.stringify({
                id_payment_operation: body.id_payment_operation ?? 'pay_mock_1',
                status: body.status ?? 'APROBADO',
                id_purchase_order: body.id_purchase_order ?? '',
            }),
        }
    )
    
    return NextResponse.json({ forwarded: notificationRes.status })
}