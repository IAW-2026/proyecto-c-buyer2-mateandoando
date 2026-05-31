const SHIPPING_API_URL = process.env.SHIPPING_API_URL
const BUYER_API_KEY = process.env.BUYER_API_KEY

const shippingHeaders = {
	'Content-Type': 'application/json',
	'X-Api-Key': BUYER_API_KEY ?? '',
}

export const shippingApi = {
	async estimateShipping(zip_code: string) {
		const res = await fetch(`${SHIPPING_API_URL}/api/shippings/estimate`, {
			method: 'POST',
			headers: shippingHeaders,
			body: JSON.stringify({ destination_zip_code: zip_code }),
		})
		return res.json()
	},

	async trackPackage(id_package: string) {
		const res = await fetch(`${SHIPPING_API_URL}/api/shippings/track/${id_package}`, {
			headers: shippingHeaders,
		})
		return res.json()
	},
}
