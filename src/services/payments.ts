import { paymentsMock } from '@/mocks/payments.mock'
import { paymentsApi } from '@/services/payments.api'

export const paymentsService = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
	? paymentsMock
	: paymentsApi
