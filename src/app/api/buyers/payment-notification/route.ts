import { withServiceAuth } from '@/lib/auth/clerk'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { isServiceTokenValid } from '@/lib/auth/clerk'

export async function POST(req: NextRequest) {
  const token = req.headers.get('X-Service-Token')
  
  if (!isServiceTokenValid(token, 'payments')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { id_payment_operation, status, id_purchase_order } = await req.json()
  
  // TODO: persist payment status to DB when schema supports it
  console.log('Payment notification received:', { id_payment_operation, status, id_purchase_order })
  
  return NextResponse.json({ received: true })
}

export const PATCH = withServiceAuth(
  'X_SERVICE_TOKEN_PAYMENTS',
  async (request: Request) => {
    const body = await request.json()
    const { id_purchase_order, id_payment_operation, status, payment_hash } = body

    if (!id_purchase_order || !id_payment_operation || !status || !payment_hash) {
      const missingFields = []

      if (!id_purchase_order) missingFields.push('id_purchase_order')
      if (!id_payment_operation) missingFields.push('id_payment_operation')
      if (!status) missingFields.push('status')
      if (!payment_hash) missingFields.push('payment_hash')

      return new Response('Missing required fields: ' + missingFields.join(', '), { status: 400 })
    }

    try {
      const updated = await db.purchaseOrder.update({
        where: { id_purchase_order },
        data: { status, id_payment_operation, payment_hash },
        select: { id_purchase_order: true, status: true, updated_at: true },
      })

      return Response.json(updated)
    } catch (error: any) {
      if (error?.code === 'P2025') {
        return new Response('Purchase order not found', { status: 404 })
      }

      throw error
    }
  }
)