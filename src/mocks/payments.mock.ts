export const paymentsMock = {
  async createPayment() {
    return { id_payment_operation: 'pay_mock_1', checkout_url: '/checkout/mock-success', status: 'PENDIENTE' }
  },
  async cancelPayment(id: string) {
    return { id_payment_operation: id, status: 'REEMBOLSADO', updated_at: new Date().toISOString() }
  }
}
