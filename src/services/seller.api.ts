const SELLER_API_URL = process.env.SELLER_API_URL

const sellerServiceHeaders = {
	'Content-Type': 'application/json',
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

function normalizeItem(raw: any, catMap: Record<string, string> = {}, defaultCategory = '') {
	const id_category = raw.id_category ?? ''
	return {
		id_item: raw.id_item ?? '',
		name: raw.name ?? '',
		price: Number(raw.price) || 0,
		description: raw.description ?? '',
		category_name: raw.category_name ?? catMap[id_category] ?? (id_category || defaultCategory),
		id_seller: raw.id_seller ?? raw.seller?.id ?? '',
		seller_name: raw.seller_name ?? raw.seller?.name ?? '',
		discount_pct: Number(raw.discount_pct) || 0,
		image_url: isValidImageUrl(raw.image_url) ? raw.image_url : null,
	}
}

function normalizeCat(raw: any) {
	return {
		category_name: raw.name ?? raw.category_name ?? '',
		item_count: raw.item_count ?? 0,
		id_category: raw.id_category ?? '',
	}
}

export const sellerApi = {
	async getItems() {
		const [itemsRes, catsRes] = await Promise.all([
			fetch(`${SELLER_API_URL}/api/items`, { headers: sellerServiceHeaders }),
			fetch(`${SELLER_API_URL}/api/categories`, { headers: sellerServiceHeaders }),
		])
		const [itemsData, catsData] = await Promise.all([itemsRes.json(), catsRes.json()])
		const catMap: Record<string, string> = {}
		for (const cat of toArray<any>(catsData))
			if (cat.id_category) catMap[cat.id_category] = cat.name ?? ''
		const items = toArray(itemsData).map(raw => normalizeItem(raw, catMap))
		return { items, page: (itemsData as any)?.page ?? 1, total: (itemsData as any)?.total ?? items.length }
	},

	async getCategories() {
		const res = await fetch(`${SELLER_API_URL}/api/categories`, {
			headers: sellerServiceHeaders,
		})
		const data = await res.json()
		return toArray(data).map(normalizeCat)
	},

	async getItemsByCategory(category_name: string) {
		const res = await fetch(
			`${SELLER_API_URL}/api/categories/${encodeURIComponent(category_name)}`,
			{ headers: sellerServiceHeaders },
		)
		const data = await res.json()
		// Pass category_name as default so items get a readable name even without a catMap
		return toArray(data).map(raw => normalizeItem(raw, {}, category_name))
	},

	async getItemDetail(category_name: string, id_item: string) {
		const res = await fetch(
			`${SELLER_API_URL}/api/categories/${encodeURIComponent(category_name)}/${encodeURIComponent(id_item)}`,
			{ headers: sellerServiceHeaders },
		)
		const data = await res.json()
		if (!data) return null
		for (const key of ['item', 'product', 'data']) {
			if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key]))
				return normalizeItem(data[key])
		}
		return normalizeItem(data)
	},

	async getSellers() {
		const res = await fetch(`${SELLER_API_URL}/api/sellers`, {
			headers: sellerServiceHeaders,
		})
		const data = await res.json()
		return toArray(data)
	},

	async getSellerById(id_seller: string) {
		const [sellerRes, itemsRes, catsRes] = await Promise.all([
			fetch(`${SELLER_API_URL}/api/sellers/${encodeURIComponent(id_seller)}`, { headers: sellerServiceHeaders }),
			fetch(`${SELLER_API_URL}/api/items`, { headers: sellerServiceHeaders }),
			fetch(`${SELLER_API_URL}/api/categories`, { headers: sellerServiceHeaders }),
		])
		const [sellerData, itemsData, catsData] = await Promise.all([
			sellerRes.json(), itemsRes.json(), catsRes.json(),
		])
		if (!sellerData) return null

		const catMap: Record<string, string> = {}
		for (const cat of toArray<any>(catsData))
			if (cat.id_category) catMap[cat.id_category] = cat.name ?? ''

		const allItems = toArray(itemsData).map(raw => normalizeItem(raw, catMap))
		const items = allItems.filter(item => item.id_seller === id_seller)

		return {
			id_seller: sellerData.id_seller ?? sellerData.id ?? id_seller,
			name: sellerData.name ?? '',
			description: sellerData.description ?? '',
			items,
		}
	},

	async getDiscounts(min_pct: number = 0) {
		const res = await fetch(`${SELLER_API_URL}/api/discounts`, {
			method: 'POST',
			headers: sellerServiceHeaders,
			body: JSON.stringify({ min_discount_percentage: min_pct }),
		})
		const data = await res.json()
		return toArray(data)
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
