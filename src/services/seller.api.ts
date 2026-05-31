const SELLER_API_URL = process.env.SELLER_API_URL
const SELLER_SERVICE_TOKEN = process.env.X_SERVICE_TOKEN_SELLER

const sellerServiceHeaders = {
	'Content-Type': 'application/json',
	'X-Service-Token': SELLER_SERVICE_TOKEN ?? '',
}

export const sellerApi = {
	async getItems() {
		const res = await fetch(`${SELLER_API_URL}/api/items`, {
			headers: sellerServiceHeaders,
		})
		return res.json()
	},

	async getCategories() {
		const res = await fetch(`${SELLER_API_URL}/api/categories`, {
			headers: sellerServiceHeaders,
		})
		return res.json()
	},

	async getItemsByCategory(category_name: string) {
		const res = await fetch(
			`${SELLER_API_URL}/api/categories/${encodeURIComponent(category_name)}`,
			{ headers: sellerServiceHeaders },
		)
		return res.json()
	},

	async getItemDetail(category_name: string, id_item: string) {
		const res = await fetch(
			`${SELLER_API_URL}/api/categories/${encodeURIComponent(category_name)}/${encodeURIComponent(id_item)}`,
			{ headers: sellerServiceHeaders },
		)
		return res.json()
	},


	async getSellers() {
		const res = await fetch(`${SELLER_API_URL}/api/sellers`, {
			headers: sellerServiceHeaders,
		})
		return res.json()
	},

	async getSellerById(id_seller: string) {
		const res = await fetch(
			`${SELLER_API_URL}/api/sellers/${encodeURIComponent(id_seller)}`,
			{ headers: sellerServiceHeaders },
		)
		return res.json()
	},

	async getDiscounts(min_pct: number = 0) {
		const res = await fetch(`${SELLER_API_URL}/api/discounts`, {
			method: 'POST',
			headers: sellerServiceHeaders,
			body: JSON.stringify({ min_discount_percentage: min_pct }),
		})
		return res.json()
	},

	async createPurchaseOrder(
		id_buyer: string,
		items: { id_item: string; quantity: number }[],
		_address: string,
		_zip_code: string,
		token?: string,
	) {
		const res = await fetch(`${SELLER_API_URL}/api/purchase-orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify({ id_buyer, items }),
		})
		return res.json()
	},
}
