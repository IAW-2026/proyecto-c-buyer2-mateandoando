import { withServiceAuth } from '@/lib/auth/clerk'
import { db } from '@/lib/db'

export const GET = withServiceAuth(
  'X_SERVICE_TOKEN_SELLER',
  async (req: Request, { params }: { params: Promise<{ id_buyer: string }> }) => {
    
    const { id_buyer } = await params

    const buyer = await db.buyer.findUnique({
      where: { id_buyer },
      select: {
        id_buyer: true,
        first_name: true,
        last_name: true,
        phone: true,
        status: true,
      },
    })

    if (!buyer) {
      return new Response('Buyer not found', { status: 404 })
    }

    return Response.json(buyer)
  }
)