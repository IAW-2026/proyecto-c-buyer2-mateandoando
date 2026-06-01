import funda    from '@/app/ui/images/funda.webp'
import kit      from '@/app/ui/images/kit.webp'
import termo    from '@/app/ui/images/termo.webp'
import yerba    from '@/app/ui/images/yerba.webp'
import bombilla from '@/app/ui/images/bombilla.webp'

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
export function getProductImage(name: string, category_name: string) {
	if (name.toLowerCase().startsWith('bombilla')) return bombilla
	return CATEGORY_IMAGES[category_name as keyof typeof CATEGORY_IMAGES] ?? null
}
