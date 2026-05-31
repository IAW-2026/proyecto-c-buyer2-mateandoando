const ITEMS = [
	{
		id_item: 'item_1',
		name: 'Mate Kit Premium',
		price: 8500,
		description: 'Kit completo con mate de calabaza, bombilla y funda.',
		category_name: 'Kits',
		id_seller: 'seller_1',
		seller_name: 'El Mateador',
		discount_pct: 0,
	},
	{
		id_item: 'item_2',
		name: 'Termo Stanley 1L',
		price: 15000,
		description: 'Termo de acero inoxidable con tapa antigoteo.',
		category_name: 'Termos',
		id_seller: 'seller_1',
		seller_name: 'El Mateador',
		discount_pct: 20,
	},
	{
		id_item: 'item_3',
		name: 'Yerba Mate Taragüi 1kg',
		price: 2500,
		description: 'Yerba mate Taragüi con palo, bolsa de 1kg.',
		category_name: 'Yerbas',
		id_seller: 'seller_2',
		seller_name: 'Yerba Buena Shop',
		discount_pct: 0,
	},
	{
		id_item: 'item_4',
		name: 'Bombilla de Alpaca',
		price: 3500,
		description: 'Bombilla artesanal de alpaca con filtro removible.',
		category_name: 'Accesorios',
		id_seller: 'seller_2',
		seller_name: 'Yerba Buena Shop',
		discount_pct: 15,
	},
	{
		id_item: 'item_5',
		name: 'Mate de Calabaza',
		price: 4500,
		description: 'Mate natural de calabaza curado, listo para usar.',
		category_name: 'Accesorios',
		id_seller: 'seller_3',
		seller_name: 'La Calabaza',
		discount_pct: 0,
	},
	{
		id_item: 'item_6',
		name: 'Yerba Amanda 500g',
		price: 1800,
		description: 'Yerba mate Amanda suave, bolsa de 500g.',
		category_name: 'Yerbas',
		id_seller: 'seller_2',
		seller_name: 'Yerba Buena Shop',
		discount_pct: 10,
	},
]

const SELLERS = [
	{
		id_seller: 'seller_1',
		name: 'El Mateador',
		description: 'Especialistas en kits y termos premium para el mate perfecto.',
	},
	{
		id_seller: 'seller_2',
		name: 'Yerba Buena Shop',
		description: 'La mejor selección de yerbas y accesorios importados.',
	},
	{
		id_seller: 'seller_3',
		name: 'La Calabaza',
		description: 'Mates artesanales de calabaza curados a mano.',
	},
]

export const sellerMock = {
	async getItems() {
		return {
			items: ITEMS,
			page: 1,
			total: ITEMS.length,
		}
	},

	async getCategories() {
		const names = [...new Set(ITEMS.map(i => i.category_name))]
		return names.map(category_name => ({
			category_name,
			item_count: ITEMS.filter(i => i.category_name === category_name).length,
		}))
	},

	async getItemsByCategory(category_name: string) {
		return ITEMS.filter(i => i.category_name === category_name)
	},

	async getItemDetail(_name: string, id_item: string) {
		return ITEMS.find(i => i.id_item === id_item) ?? null
	},

	async getSellers() {
		return SELLERS
	},

	async getSellerById(id_seller: string) {
		const seller = SELLERS.find(s => s.id_seller === id_seller)
		if (!seller) return null
		return {
			...seller,
			items: ITEMS.filter(i => i.id_seller === id_seller),
		}
	},

	async getDiscounts(min_pct: number = 0) {
		return ITEMS
			.filter(i => i.discount_pct > 0 && i.discount_pct >= min_pct)
			.map(i => ({
				id_item: i.id_item,
				name: i.name,
				price: Math.round(i.price * (1 - i.discount_pct / 100)),
				original_price: i.price,
				discount_pct: i.discount_pct,
				category_name: i.category_name,
				id_seller: i.id_seller,
			}))
	},

	async createPurchaseOrder(
		id_buyer: string,
		items: { id_item: string, quantity: number }[],
		_address: string,
		_zip_code: string,
	) {
		const itemMap: Record<string, { price: number, id_seller: string, discount_pct: number }> = {}
		for (const item of ITEMS) {
			itemMap[item.id_item] = {
				price: item.price,
				id_seller: item.id_seller,
				discount_pct: item.discount_pct,
			}
		}

		const packageMap: Record<string, { id_item: string, quantity: number, unit_price: number }[]> = {}
		let total_price = 0

		for (const { id_item, quantity } of items) {
			const info = itemMap[id_item] ?? { price: 1000, id_seller: 'seller_1', discount_pct: 0 }
			const unit_price = info.discount_pct > 0
				? Math.round(info.price * (1 - info.discount_pct / 100))
				: info.price
			total_price += unit_price * quantity
			if (!packageMap[info.id_seller]) packageMap[info.id_seller] = []
			packageMap[info.id_seller].push({
				id_item,
				quantity,
				unit_price,
			})
		}

		const packages = Object.entries(packageMap).map(([id_seller, pkgItems]) => ({
			id_package: crypto.randomUUID(),
			id_seller,
			items: pkgItems,
		}))

		return {
			id_purchase_order: crypto.randomUUID(),
			total_price,
			packages,
		}
	},
}
