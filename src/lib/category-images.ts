import funda    from '@/app/ui/images/funda.webp'
import kit      from '@/app/ui/images/kit.webp'
import termo    from '@/app/ui/images/termo.webp'
import yerba    from '@/app/ui/images/yerba.webp'
import bombilla from '@/app/ui/images/bombilla.webp'
import mate     from '@/app/ui/images/mate.webp'

const CATEGORY_IMAGES = {
	Accesorios: funda,
	Kits: kit,
	Termos: termo,
	Yerbas: yerba,
} as const

/**
 * Returns the image for a product, applying name-based overrides
 * before falling back to the category image.
 */
export function getProductImage(
	name: string | undefined,
	category_name: string | undefined,
	image_url?: string | null,
) {
	if (image_url) return image_url
	const lower = (name ?? '').toLowerCase()
	if (lower.startsWith('bombilla')) return bombilla
	if (lower.startsWith('mate'))     return mate
	return CATEGORY_IMAGES[(category_name ?? '') as keyof typeof CATEGORY_IMAGES] ?? null
}
