import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sellerService } from '@/services/seller'
import { paymentsService } from '@/services/payments'

export async function POST(req: NextRequest) {
    const { userId } = await auth()

    if (!userId)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        
    const { id_buyer, address, items } = await req.json()
    
    // Snapshot prices via Seller App
    const purchaseOrder = await sellerService.createPurchaseOrder(id_buyer, items)
    
    // Save address to DB
    await db.address.create({
        data: {
            id_buyer,
            alias: 'Envío', 
            street: address.street,
            floor_apt: address.floor_apt ?? null,
            city: address.city,
            province: address.province,
            zip_code: address.zip_code,
        },
    })
    
    // Request payment from Payments App
    const payment = await paymentsService.createPayment()
    
    return NextResponse.json({
        checkout_url: payment.checkout_url,
        id_payment_operation: payment.id_payment_operation,
        id_purchase_order: purchaseOrder.id_purchase_order,
    })
}