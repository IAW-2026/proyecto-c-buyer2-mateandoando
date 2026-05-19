import { db } from '@/lib/db'
import { isServiceTokenValid } from '@/lib/auth/clerk'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_buyer: string }> }
) {
  const token = request.headers.get('X-Service-Token')

  if (!isServiceTokenValid(token ?? undefined, process.env.X_SERVICE_TOKEN_SELLER)) {
    return new Response('Unauthorized', { status: 401 })
  }

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