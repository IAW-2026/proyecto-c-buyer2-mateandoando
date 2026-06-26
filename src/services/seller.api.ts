const SELLER_API_URL = process.env.SELLER_API_URL

function sellerServiceHeaders() {
	return {
		'Content-Type': 'application/json',
		'x-api-key': process.env.BUYER_SELLER_API_KEY ?? '',
	}
}

function toArray<T>(data: unknown): T[] {
	if (Array.isArray(data)) return data
	if (data && typeof data === 'object') {
		for (const key of ['items', 'data', 'results', 'categories', 'sellers', 'discounts']) {
			const val = (data as Record<string, unknown>)[key]
			if (Array.isArray(val)) return val as T[]
		}
	}
	return []
}

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|$)/i
const TRUSTED_IMAGE_HOSTS = ['aa2b4pe3oj.ufs.sh']

function isValidImageUrl(url: unknown): url is string {
	if (!url || typeof url !== 'string') return false
	try {
		const { hostname, pathname } = new URL(url)
		return TRUSTED_IMAGE_HOSTS.includes(hostname) || IMAGE_EXTENSIONS.test(pathname)
	} catch {
		return false
	}
}

function parseItem(raw: any) {
	const seller = raw.seller
	return {
		id_item: raw.id_item ?? '',
		name: raw.name ?? '',
		price: Number(raw.price) || 0,
		description: raw.description ?? '',
		category_name: raw.category_name ?? '',
		id_seller: raw.id_seller ?? seller?.id_seller ?? '',
		seller_name: raw.seller_name ?? seller?.name ?? '',
		discount_pct: raw.discount_percentage ?? 0,
		image_url: isValidImageUrl(raw.image_url) ? raw.image_url : null,
		stock: raw.stock != null ? Number(raw.stock) : null,
		rating: seller?.rating != null ? Number(seller.rating) : (raw.rating != null ? Number(raw.rating) : null),
	}
}


export const sellerApi = {
	async getItems() {
		const res = await fetch(`${SELLER_API_URL}/api/items`, { headers: sellerServiceHeaders() })
		const data = await res.json()
		const items = toArray<any>(data).map(parseItem)
		return { items, page: (data as any)?.page ?? 1, total: (data as any)?.total ?? items.length }
	},

	async getCategories() {
		const [catsRes, itemsRes] = await Promise.all([
			fetch(`${SELLER_API_URL}/api/categories`, { headers: sellerServiceHeaders() }),
			fetch(`${SELLER_API_URL}/api/items`, { headers: sellerServiceHeaders() }),
		])
		const [catsData, itemsData] = await Promise.all([catsRes.json(), itemsRes.json()])

		const countById: Record<string, number> = {}
		for (const item of toArray<any>(itemsData))
			if (item.id_category) countById[item.id_category] = (countById[item.id_category] ?? 0) + 1

		return toArray<any>(catsData).map(raw => ({
			name: raw.name ?? raw.category_name ?? '',
			id_category: raw.id_category ?? '',
			item_count: raw.item_count ?? countById[raw.id_category] ?? 0,
		}))
	},

	async getItemsByCategory(category_name: string) {
		const res = await fetch(
			`${SELLER_API_URL}/api/categories/${encodeURIComponent(category_name)}`,
			{ headers: sellerServiceHeaders() },
		)
		const data = await res.json()
		// Seller API items don't include category_name — inject it from the route param so navigation links work
		return toArray<any>(data).map(raw => parseItem({ ...raw, category_name: raw.category_name ?? category_name }))
	},

	async getItemDetail(category_name: string, id_item: string) {
		const res = await fetch(
			`${SELLER_API_URL}/api/categories/${encodeURIComponent(category_name)}/${encodeURIComponent(id_item)}`,
			{ headers: sellerServiceHeaders() },
		)
		const data = await res.json()
		if (!data) return null
		for (const key of ['item', 'product', 'data']) {
			if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key]))
				return parseItem(data[key])
		}
		return parseItem(data)
	},

	async getSellers() {
		const res = await fetch(`${SELLER_API_URL}/api/sellers`, {
			headers: sellerServiceHeaders(),
		})
		const data = await res.json()
		return toArray<any>(data).map((raw: any) => ({
			id_seller: raw.id_seller ?? raw.id ?? '',
			name: raw.name ?? '',
			description: raw.description ?? '',
			rating: raw.rating != null ? Number(raw.rating) : null,
		}))
	},

	async getSellerById(id_seller: string) {
		const [sellerRes, itemsRes] = await Promise.all([
			fetch(`${SELLER_API_URL}/api/sellers/${encodeURIComponent(id_seller)}`, { headers: sellerServiceHeaders() }),
			fetch(`${SELLER_API_URL}/api/items`, { headers: sellerServiceHeaders() }),
		])
		const [sellerData, itemsData] = await Promise.all([sellerRes.json(), itemsRes.json()])
		if (!sellerData) return null

		const allItems = toArray<any>(itemsData).map(parseItem)
		const items = allItems.filter(item => item.id_seller === id_seller)

		return {
			id_seller: sellerData.id_seller ?? sellerData.id ?? id_seller,
			name: sellerData.name ?? '',
			description: sellerData.description ?? '',
			rating: sellerData.rating != null ? Number(sellerData.rating) : null,
			items,
		}
	},

	async getDiscounts(min_pct: number = 0) {
		const res = await fetch(`${SELLER_API_URL}/api/discounts`, {
			method: 'POST',
			headers: sellerServiceHeaders(),
			body: JSON.stringify({ min_discount_percentage: min_pct }),
		})
		const data = await res.json()
		return toArray(data)
	},

	async createPurchaseOrder(
		id_buyer: string,
		items: { id_item: string; quantity: number }[],
		address: string,
		zip_code: string,
		token?: string,
	) {
		const body = { id_buyer, items, address_snapshot: address, zip_code: Number(zip_code) }
		const res = await fetch(`${SELLER_API_URL}/api/purchase-orders`, {
			method: 'POST',
			headers: {
				...sellerServiceHeaders(),
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify(body),
		})
		return res.json()
	},
}
