const PAYMENTS_API_URL = process.env.PAYMENTS_API_URL?.replace(/\/$/, '')

type CreatePaymentPayload = {
	id_purchase_order: string
	id_buyer: string
	total_price: number
	packages: {
		id_package: string
		id_seller: string
		amount: number
	}[]
}

export const paymentsApi = {
	async createPayment(payload: CreatePaymentPayload, token?: string) {
		const res = await fetch(`${PAYMENTS_API_URL}/api/payments/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify(payload),
		})
		return res.json()
	},

	async getPaymentHistory(id_buyer: string) {
		const res = await fetch(
			`${PAYMENTS_API_URL}/api/payments/history/buyer/${id_buyer}`,
			{ headers: { 'X-Api-Key': process.env.BUYER_APP_SECRET_KEY ?? '' } },
		)
		if (!res.ok) return []
		try {
			return await res.json()
		} catch {
			return []
		}
	},

	async cancelPayment(id_payment_operation: string, token?: string) {
		const res = await fetch(
			`${PAYMENTS_API_URL}/api/payments/transactions/${id_payment_operation}/cancelled`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'X-Api-Key': process.env.BUYER_APP_SECRET_KEY ?? '',
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify({ status: 'CANCELADO' }),
			}
		)
		return res.json()
	},
}
