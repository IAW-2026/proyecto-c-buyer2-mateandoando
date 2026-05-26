import Link from 'next/link'
import { sellerService } from '@/services/seller'
import { ArrowRight, Store } from 'lucide-react'

export default async function VendedoresPage() {
    const sellers = await sellerService.getSellers()
    
    return (
        <>
            {/* Header */}
            <section className="mb-8">
                <h1 className="text-headline-xl font-headline-xl text-primary mb-2">
                    Vendedores
                </h1>
                <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
                    Conocé a los artesanos y comerciantes que hacen posible MateandoAndo.
                </p>
            </section>
            
            {/* Seller grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellers.map((seller) => (
                    <Link
                        key={seller.id_seller}
                        href={`/vendedores/${seller.id_seller}`}
                        className="group bg-surface-container-low rounded-xl p-6 border border-outline-variant hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col"
                    >

                        {/* profile image placeholder. TODO: Search and replace image */}
                        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant ">
                            <Store size={28} className="text-on-surface-variant" />
                        </div>
                        
                        {/* Seller information */}
                        <div className="flex flex-col gap-1 flex-grow">
                            <h2 className="text-headline-md font-headline-md text-on-surface group-hover:text-primary transition-colors">
                                {seller.name}
                            </h2>

                            <p className="text-body-sm text-on-surface-variant line-clamp-2">
                                {seller.description}
                            </p>
                        </div>
                        
                        {/* See catalog button */}
                        <div className="flex items-center gap-1 text-primary text-label-md font-label-md">
                            Ver catálogo
                            <ArrowRight
                                size={16}
                                className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-200"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}