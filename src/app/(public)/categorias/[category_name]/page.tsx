import { Suspense } from 'react'
import Link from 'next/link'
import { sellerService } from '@/services/seller'
import ProductCard from '@/components/product-card'
import CategoryFilters from './category-filters'

interface Props {
    params: Promise<{ category_name: string }>
    searchParams: Promise<{ descuento?: string }>
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { category_name } = await params
    const { descuento } = await searchParams
    const decoded = decodeURIComponent(category_name)
    const onlyDiscounted = descuento === 'true'
    
    const items = await sellerService.getItemsByCategory(decoded)
    const filtered = onlyDiscounted ? items.filter((item) => item.discount_pct > 0) : items
    
    return (
        <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-6">
                <Link href="/" className="hover:text-primary transition-colors">
                    Inicio
                </Link>
                <span>/</span>
                
                <Link href="/categorias" className="hover:text-primary transition-colors">
                    Categoría
                </Link>
                <span>/</span>
                
                <span className="text-on-surface">{decoded}</span>
            </nav>
            
            {/* Header */}
            <section className="mb-8">
                <h1 className="text-headline-xl font-headline-xl text-primary mb-2">
                    {decoded}
                </h1>
                <p className="text-body-lg font-body-lg text-on-surface-variant">
                    {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                    {onlyDiscounted && ' con descuento'}
                </p>
            </section>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                <Suspense fallback={null}>
                    <CategoryFilters descuento={onlyDiscounted} />
                </Suspense>
                </aside>
                
                {/* Grid */}
                <div className="flex-grow">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                            <p className="text-body-md">
                                No hay productos con descuento en esta categoría.
                            </p>

                            <Link href={`/categorias/${category_name}`} className="mt-4 text-primary text-body-sm hover:underline">
                                Ver todos los productos
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map((item) => (
                                <ProductCard
                                    key={item.id_item}
                                    id_item={item.id_item}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    category_name={item.category_name}
                                    seller_name={item.seller_name}
                                    discount_pct={item.discount_pct}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}