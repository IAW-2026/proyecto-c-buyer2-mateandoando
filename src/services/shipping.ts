import { shippingMock } from '@/mocks/shipping.mock'

export const shippingService = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
	? shippingMock
	: shippingMock // replace with shippingApi when real integration arrives
