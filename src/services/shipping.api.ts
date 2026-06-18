const SHIPPING_API_URL = process.env.SHIPPING_API_URL

function serviceHeaders() {
	return {
		'Content-Type': 'application/json',
		'x-api-key': process.env.BUYER_API_KEY ?? '',
	}
}

export const shippingApi = {
	async estimateShipping(zip_code: string) {
		const base = SHIPPING_API_URL?.replace(/\/$/, '')
		const url = `${base}/api/shippings/estimate`
		const res = await fetch(url, {
			method: 'POST',
			headers: serviceHeaders(),
			body: JSON.stringify({ destination_zip_code: zip_code }),
		})
		return res.json()
	},

	async trackPackage(id_package: string) {
		const base = SHIPPING_API_URL?.replace(/\/$/, '')
		const res = await fetch(`${base}/api/shippings/track/${id_package}`, {
			headers: serviceHeaders(),
		})
		return res.json()
	},
}
