import { NextRequest, NextResponse } from 'next/server'
import { isServiceTokenValid } from '@/lib/auth/clerk'
import { db } from '@/lib/db'

const FECHA_CORTE = new Date('2026-06-21T00:00:00.000Z')

export async function GET(req: NextRequest) {
	const key = req.headers.get('x-api-key')

	if (!isServiceTokenValid(key ?? undefined, process.env.DASHBOARD_API_KEY)) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const [
		total_users,
		total_orders,
		orders_by_status,
		active_buyers,
		revenue_result,
	] = await Promise.all([
		db.buyer.count({
			where: { created_at: { gte: FECHA_CORTE } },
		}),
		db.purchaseOrder.count({
			where: { created_at: { gte: FECHA_CORTE } },
		}),
		db.purchaseOrder.groupBy({
			by: ['status'],
			_count: { status: true },
			where: { created_at: { gte: FECHA_CORTE } },
		}),
		db.buyer.count({
			where: {
				purchase_orders: { some: { status: 'APROBADO', created_at: { gte: FECHA_CORTE } } },
			},
		}),
		db.purchaseOrder.aggregate({
			where: { status: 'APROBADO', created_at: { gte: FECHA_CORTE } },
			_sum: { total_price: true },
		}),
	])

	const status_breakdown = Object.fromEntries(
		orders_by_status.map(row => [row.status, row._count.status])
	)

	const approved_orders = status_breakdown['APROBADO'] ?? 0
	const conversion_rate = total_orders > 0
		? Math.round((approved_orders / total_orders) * 100)
		: 0

	const total_revenue = Number(revenue_result._sum.total_price ?? 0)

	return NextResponse.json({
		total_users,
		active_buyers,
		total_orders,
		orders_by_status: status_breakdown,
		conversion_rate,
		total_revenue,
		average_rating: null,
	})
}
