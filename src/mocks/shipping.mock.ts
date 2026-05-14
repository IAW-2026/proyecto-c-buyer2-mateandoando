export const shippingMock = {
  async estimateShipping(zip_code: string) {
    return { cost: 5000, estimated_days: 7, zip_code }
  },
  async trackPackage(id_package: string) {
    return { status: 'EN_TRANSITO', carrier_name: 'Mock Carrier', history: [], id_package }
  }
}
