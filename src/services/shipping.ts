import { shippingMock } from '@/mocks/shipping.mock'
import { shippingApi } from '@/services/shipping.api'

export const shippingService = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
	? shippingMock
	: shippingApi
