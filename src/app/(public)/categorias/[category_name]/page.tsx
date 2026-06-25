import { Suspense } from 'react'
import { sellerService } from '@/services/seller'
import CategoryFilters from './category-filters'
import Breadcrumb from '@/components/breadcrumb'
import CategoriesGrid from '@/components/categories/categories-grid'

export const dynamic = 'force-dynamic'

interface Props {
    params: Promise<{ category_name: string }>
    searchParams: Promise<{
        descuento?: string
        precio_min?: string
        precio_max?: string
        orden?: string
        stock?: string
    }>
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { category_name } = await params
    const { descuento, precio_min, precio_max, orden, stock } = await searchParams
    const decoded = decodeURIComponent(category_name)

    const onlyDiscounted = descuento === 'true'
    const onlyInStock = stock === 'true'
    const sortOrder = orden ?? ''

    const items = await sellerService.getItemsByCategory(decoded)

    const withEffectivePrice = items.map(item => ({
        ...item,
        effective_price: item.discount_pct > 0
            ? Math.round(item.price * (1 - item.discount_pct / 100))
            : item.price,
    }))

    const prices = withEffectivePrice.map(i => i.effective_price)
    const globalMin = prices.length > 0 ? Math.min(...prices) : 0
    const globalMax = prices.length > 0 ? Math.max(...prices) : 0

    const currentMin = precio_min ? Number(precio_min) : globalMin
    const currentMax = precio_max ? Number(precio_max) : globalMax

    let filtered = withEffectivePrice

    if (onlyDiscounted) filtered = filtered.filter(i => i.discount_pct > 0)
    if (onlyInStock) filtered = filtered.filter(i => (i.stock ?? 1) > 0)
    filtered = filtered.filter(i => i.effective_price >= currentMin && i.effective_price <= currentMax)

    if (sortOrder === 'precio_asc') filtered = [...filtered].sort((a, b) => a.effective_price - b.effective_price)
    else if (sortOrder === 'precio_desc') filtered = [...filtered].sort((a, b) => b.effective_price - a.effective_price)
    else if (sortOrder === 'descuento') filtered = [...filtered].sort((a, b) => b.discount_pct - a.discount_pct)

    const hasActiveFilters = onlyDiscounted || onlyInStock || !!sortOrder || !!precio_min || !!precio_max

    return (
        <>
            <Breadcrumb items={[
                { label: 'Inicio', href: '/' },
                { label: 'Categorías', href: '/categorias' },
                { label: decoded },
            ]} />

            <section className="mb-8">
                <h1 className="text-headline-xl font-headline-xl text-primary mb-2">
                    {decoded}
                </h1>
                <p className="text-body-lg font-body-lg text-on-surface-variant">
                    {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
                </p>
            </section>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <Suspense fallback={null}>
                        <CategoryFilters
                            descuento={onlyDiscounted}
                            soloStock={onlyInStock}
                            orden={sortOrder}
                            globalMin={globalMin}
                            globalMax={globalMax}
                            currentMin={currentMin}
                            currentMax={currentMax}
                        />
                    </Suspense>
                </aside>

                <CategoriesGrid
                    items={filtered}
                    category_name={category_name}
                    hasActiveFilters={hasActiveFilters}
                />
            </div>
        </>
    )
}
