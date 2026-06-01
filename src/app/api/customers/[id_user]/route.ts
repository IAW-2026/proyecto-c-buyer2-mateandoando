import { withApiKeyAuth } from '@/lib/auth/clerk'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export const GET = withApiKeyAuth(
    'BUYER_API_KEY',
    async (req: Request, { params }: { params: Promise<{ id_user: string }> }) => {
        const { id_user } = await params

        const buyer = await db.buyer.findUnique({
            where: { clerk_user_id: id_user },
            select: {
                first_name: true,
                last_name: true,
                phone: true,
            },
        })

        if (!buyer) {
            return new Response('Buyer not found', { status: 404 })
        }

        let email = ''

        try {
            const user = await (await clerkClient()).users.getUser(id_user)
            email = user.primaryEmailAddress?.emailAddress ?? ''
        } catch {
            // buyer exists in database but not in Clerk
        }

        return Response.json({
            id_user,
            first_name: buyer.first_name,
            last_name: buyer.last_name,
            phone: buyer.phone,
            email,
        })
    }
)