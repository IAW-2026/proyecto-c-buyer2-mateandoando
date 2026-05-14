export const sellerMock = {
  async getItems() {
    return { items: [], page: 1, total: 0 }
  },
  async getItemDetail(_name: string, id: string) {
    return { id, name: 'Producto de ejemplo', price: 1000 }
  },
  async getCategories() {
    return [{ name: 'General' }]
  }
}
