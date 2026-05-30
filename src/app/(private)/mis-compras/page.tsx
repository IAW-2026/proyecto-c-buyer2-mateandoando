import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import EmptyOrders from '@/components/orders/empty-orders'
import OrderRow from '@/components/orders/order-row'

export default async function MisComprasPage() {
	const { userId } = await auth()

	const buyer = await db.buyer.findUnique({
		where: { clerk_user_id: userId! },
		select: { id_buyer: true },
	})

	if (!buyer) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
				<p className="text-body-md">Cuenta de comprador no encontrada.</p>
			</div>
		)
	}

	const orders = await db.purchaseOrder.findMany({
		where: { id_buyer: buyer.id_buyer },
		include: {
			packages: {
				include: { items: true },
			},
		},
		orderBy: { created_at: 'desc' },
	})

	return (
		<>
			<section className="mb-8">
				<h1 className="text-headline-xl font-headline-xl text-primary mb-2">
					Mis Compras
				</h1>
				<p className="text-body-lg font-body-lg text-on-surface-variant">
					Consultá el historial de tus compras.
				</p>
			</section>

			{orders.length === 0
				? <EmptyOrders />
				: <div className="flex flex-col divide-y divide-outline-variant">
					{orders.map(order => (
						<OrderRow
							key={order.id_purchase_order}
							id_purchase_order={order.id_purchase_order}
							created_at={order.created_at}
							total_price={Number(order.total_price)}
							status={order.status}
							packages={order.packages}
						/>
					))}
				</div>
			}
		</>
	)
}
