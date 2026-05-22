import { paymentsMock } from '@/mocks/payments.mock'

export const paymentsService = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
    ? paymentsMock
    : paymentsMock // replace with paymentsApi when real integration arrives