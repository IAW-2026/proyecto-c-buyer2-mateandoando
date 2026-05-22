import { sellerMock } from '@/mocks/seller.mock'

export const sellerService = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
	? sellerMock
	: sellerMock // replace with sellerApi when real integration arrives
