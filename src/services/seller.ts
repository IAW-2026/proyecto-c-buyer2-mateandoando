import { sellerMock } from '@/mocks/seller.mock'
import { sellerApi } from '@/services/seller.api'

export const sellerService = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
	? sellerMock
	: sellerApi
