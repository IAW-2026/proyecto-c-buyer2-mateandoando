import Link from 'next/link'
import { sellerService } from '@/services/seller'
import { ArrowRight } from 'lucide-react'

export default async function CategoriasPage() {
    const categories = await sellerService.getCategories()
    
    return (
        <>
            <section className="mb-8">
                <h1 className="text-headline-xl font-headline-xl text-primary mb-2">
                    Explorar Categorías
                </h1>
                <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
                    Descubrí nuestra selección de productos artesanales, elaborados con materiales sostenibles y técnicas tradicionales.
                </p>
            </section>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <Link
                        key={cat.category_name}
                        href={`/categorias/${encodeURIComponent(cat.category_name)}`}
                        className="group flex flex-col cursor-pointer"
                    >
                        {/* Image placeholder */}
                            <div className="relative overflow-hidden rounded-xl border border-outline-variant aspect-[4/5] bg-surface-container flex items-center justify-center">
                                <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">
                                    {cat.category_name[0]}
                                </span>
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        
                        {/* Label */}
                        <div className="mt-3 flex justify-between items-center">
                            <h3 className="text-headline-md font-headline-md text-on-surface">
                                {cat.category_name}
                            </h3>
                            <ArrowRight
                                size={20}
                                className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                            />
                        </div>
                        <p className="text-body-sm text-on-surface-variant">
                        {   cat.item_count} {cat.item_count === 1 ? 'producto' : 'productos'}
                        </p>
                    </Link>
                ))}
            </div>
        </>
    )
}