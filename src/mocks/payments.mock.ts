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

export const paymentsMock = {
	async createPayment(_payload: CreatePaymentPayload, _token?: string) {
		return {
			id_payment_operation: 'pay_mock_1',
			checkout_url: '/checkout/mock-success',
			status: 'PENDIENTE',
		}
	},

	async cancelPayment(_id_payment_operation: string, _token?: string) {
		return {
			id_payment_operation: _id_payment_operation,
			status: 'REEMBOLSADO',
			updated_at: new Date().toISOString(),
		}
	},
}
