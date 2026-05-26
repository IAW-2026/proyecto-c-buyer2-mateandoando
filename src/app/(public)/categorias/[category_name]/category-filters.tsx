'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Props {
    descuento: boolean
}

export default function CategoryFilters({ descuento }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    function toggleDiscount(checked: boolean) {
        const params = new URLSearchParams(searchParams.toString())

        if (checked) {
            params.set('descuento', 'true')
        } else {
            params.delete('descuento')
        }

        router.push(
            `${pathname}?${params.toString()}`
        )
    }
    
    return (
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-6 sticky top-24">
            <h3 className="text-label-md font-label-md text-primary uppercase">Filtros</h3>
            
            <div>
                <h4 className="text-label-md font-label-md text-primary uppercase mb-3">Precio</h4>
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={descuento}
                            onChange={(e) => toggleDiscount(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                        />
                        <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                            Solo con descuento
                        </span>
                    </label>
            </div>
        </div>
    )
}