import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sellerService } from '@/services/seller'
import ProductCard from '@/components/product-card'
import { Store } from 'lucide-react'

interface Props {
    params: Promise<{ id_seller: string }>
}

export default async function SellerProfilePage({ params }: Props) {
    const { id_seller } = await params
    const seller = await sellerService.getSellerById(id_seller)
    
    if (!seller) notFound()
        
    return (
        <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-8">
                <Link href="/" className="hover:text-primary transition-colors">
                    Inicio
                </Link>
                <span>/</span>

                <Link href="/vendedores" className="hover:text-primary transition-colors">
                    Vendedores
                </Link>
                <span>/</span>

                <span className="text-on-surface">{seller.name}</span>
            </nav>
            
            {/* Seller hero */}
            <section className="bg-surface-container-low rounded-xl border border-outline-variant p-8 mb-10 flex flex-col sm:flex-row gap-6 items-start">
            
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center flex-shrink-0">
                    <Store size={36} className="text-on-surface-variant" />
                </div>
                    
                {/* Info */}
                <div className="flex flex-col gap-3 flex-grow">
                    <h1 className="text-headline-lg font-headline-lg text-primary">
                            {seller.name}
                    </h1>
                    <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
                            {seller.description}
                    </p>

                    <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                        <span className="bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
                            {seller.items.length} {seller.items.length === 1 ? 'producto' : 'productos'}
                        </span>
                    </div>
                </div>
            </section>
            
            {/* Catalog */}
            <section>
                <h2 className="text-headline-md font-headline-md text-on-surface mb-6">
                    Catálogo
                </h2>
                
                {seller.items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                        <p className="text-body-md">Este vendedor no tiene productos todavía.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {seller.items.map((item) => (
                            <ProductCard
                                key={item.id_item}
                                id_item={item.id_item}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                category_name={item.category_name}
                                seller_name={seller.name}
                                discount_pct={item.discount_pct}
                            />
                        ))}
                    </div>
            )}
            </section>
        </>
    )
}