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
		const headers = serviceHeaders()
		console.log('[shipping.api] POST', url)
		console.log('[shipping.api] x-api-key set?', !!headers['x-api-key'], '| length:', headers['x-api-key'].length)
		const res = await fetch(url, {
			method: 'POST',
			headers,
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
