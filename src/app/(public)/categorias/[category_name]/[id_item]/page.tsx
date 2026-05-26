import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sellerService } from '@/services/seller'
import AddToCartButton from './add-to-cart-button'

interface Props {
    params: Promise<{ category_name: string; id_item: string }>
}

export default async function ProductDetailPage({ params }: Props) {
    const { category_name, id_item } = await params
    const decoded = decodeURIComponent(category_name)
    const item = await sellerService.getItemDetail(decoded, id_item)

    if (!item)
        notFound()
        
    const hasDiscount = item.discount_pct > 0
    const discountedPrice = hasDiscount ? Math.round(item.price * (1 - item.discount_pct / 100)) : null
    
    return (
        <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-8">
                <Link href="/" className="hover:text-primary transition-colors">
                    Inicio
                </Link>
                <span>/</span>
                
                <Link href="/categorias" className="hover:text-primary transition-colors">
                    Categorías
                </Link>
                <span>/</span>

                <Link href={`/categorias/${category_name}`} className="hover:text-primary transition-colors">
                    {decoded}
                </Link>
                <span>/</span>

                <span className="text-on-surface line-clamp-1">
                    {item.name}
                </span>
            </nav>
            
            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
                {/* Image - TODO: Search and replace images */}
                <section className="lg:col-span-7">
                    <div className="overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant aspect-square flex items-center justify-center">
                        <span className="text-8xl font-heading font-bold text-outline opacity-30">
                            {item.name[0]} {/* Just display the first letter of the product name for now */}
                        </span>
                    </div>
                </section>
                
                {/* Product information */}
                <section className="lg:col-span-5 flex flex-col gap-6">
                
                    {/* Badges - TODO: review */}
                    <div className="flex gap-2 flex-wrap">
                        <span className="bg-surface-container text-on-surface-variant text-label-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                            {decoded}
                        </span>
                        
                        {
                            hasDiscount && (
                                <span className="bg-secondary-container text-on-secondary-container text-label-sm font-semibold px-3 py-1 rounded-full">
                                    −{item.discount_pct}% OFF
                                </span>
                            )
                        }
                    </div>
                    
                    {/* Name */}
                    <h1 className="text-headline-xl font-headline-xl text-primary leading-tight">
                        {item.name}
                    </h1>
                    
                    {/* Seller */}
                    <Link
                        href={`/vendedores/${item.id_seller}`}
                        className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                        por <span className="font-semibold">{item.seller_name}</span>
                    </Link>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-4">
                        {discountedPrice ? (
                            <>
                                <span className="text-headline-lg font-headline-lg text-primary">
                                    ${discountedPrice.toLocaleString('es-AR')}
                                </span>
                                <span className="text-body-lg text-on-surface-variant line-through">
                                    ${item.price.toLocaleString('es-AR')}
                                </span>
                            </>
                        ) : (
                            <span className="text-headline-lg font-headline-lg text-primary">
                                ${item.price.toLocaleString('es-AR')}
                            </span>
                        )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant pt-6">
                        {item.description}
                    </p>
                    
                    {/* Add to cart button */}
                    <div className="flex flex-col gap-3 pt-2">
                        <AddToCartButton id_item={item.id_item} />

                        {/* TODO: Improve this */}
                        <div className="flex justify-between items-center px-4 py-3 border border-outline-variant rounded-lg">
                            <span className="text-body-sm text-on-surface-variant">
                                Envío a todo el país
                            </span>
                            <span className="text-body-sm text-on-surface-variant">
                                Pago seguro
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}