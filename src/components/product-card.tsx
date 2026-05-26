import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface Props {
    id_item: string
    name: string
    description: string
    price: number
    category_name: string
    seller_name: string
    discount_pct: number
}

export default function ProductCard({
    id_item,
    name,
    description,
    price,
    category_name,
    seller_name,
    discount_pct,
}: Props) {
    const hasDiscount = discount_pct > 0
    const discountedPrice = hasDiscount
    ? Math.round(price * (1 - discount_pct / 100))
    : null
    
    const detailHref = `/categorias/${encodeURIComponent(category_name)}/${id_item}`
    
    return (
        <div className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
        
            {/* Image section */}
            <Link href={detailHref} className="relative aspect-video overflow-hidden bg-surface-container block">

                {/* Images placeholder. TODO: search and replace images */}
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <ShoppingCart size={32} className="text-outline" />
                </div>
        
                {/* Discount badge */}
        
                {hasDiscount && (
                    <span className="absolute top-2 right-2 bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold px-2 py-0.5 rounded-full">
                       −{discount_pct}%
                    </span>
                )}

            </Link>
        
            {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-body-md font-bold text-on-surface mb-1 line-clamp-1">{name}</h3>
                    <p className="text-label-sm text-on-surface-variant mb-1">{seller_name}</p>
                    <p className="text-label-sm text-on-surface-variant mb-4 line-clamp-2">{description}</p>
                
                    <div className="mt-auto flex justify-between items-center">
                        <div className="flex flex-col">
                        {discountedPrice ? (
                            <>
                            <span className="text-body-md font-bold text-primary-container">
                                ${discountedPrice.toLocaleString('es-AR')}
                            </span>
                            <span className="text-label-sm text-on-surface-variant line-through">
                                ${price.toLocaleString('es-AR')}
                            </span>
                            </>
                        ) : (
                            <span className="text-body-md font-bold text-primary-container">
                                ${price.toLocaleString('es-AR')}
                            </span>
                        )}
                    </div>
                    
                    {/* Add to cart button */}
                    <Link
                        href={detailHref}
                        className="text-primary hover:text-secondary transition-colors p-1"
                        aria-label={`Ver detalle de ${name}`}
                        >
                        <ShoppingCart size={20} />
                    </Link>
                </div>
            </div>
        </div>
    )
}