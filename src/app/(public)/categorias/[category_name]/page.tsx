import { Suspense } from 'react'
import { sellerService } from '@/services/seller'
import CategoryFilters from './category-filters'
import Breadcrumb from '@/components/breadcrumb'
import CategoriesGrid from '@/components/categories/categories-grid'

export const dynamic = 'force-dynamic'

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
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Categorías', href: '/categorias' },
                { label: decoded },
            ]} />
            
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
                
                <CategoriesGrid
                    items={filtered}
                    category_name={category_name}
                    onlyDiscounted={onlyDiscounted}
                />
            </div>
        </>
    )
}