const SHIPPING_API_URL = process.env.SHIPPING_API_URL

export const shippingApi = {
	async estimateShipping(zip_code: string) {
		const res = await fetch(`${SHIPPING_API_URL}/api/shippings/estimate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ destination_zip_code: zip_code }),
		})
		return res.json()
	},

	async trackPackage(id_package: string) {
		const res = await fetch(`${SHIPPING_API_URL}/api/shippings/track/${id_package}`)
		return res.json()
	},
}
