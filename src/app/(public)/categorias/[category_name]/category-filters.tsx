'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

interface Props {
    descuento: boolean
    soloStock: boolean
    orden: string
    globalMin: number
    globalMax: number
    currentMin: number
    currentMax: number
}

const RANGE_INPUT_CLASS = [
    'absolute w-full h-full pointer-events-none appearance-none bg-transparent',
    '[&::-webkit-slider-thumb]:pointer-events-auto',
    '[&::-webkit-slider-thumb]:appearance-none',
    '[&::-webkit-slider-thumb]:w-4',
    '[&::-webkit-slider-thumb]:h-4',
    '[&::-webkit-slider-thumb]:rounded-full',
    '[&::-webkit-slider-thumb]:bg-primary',
    '[&::-webkit-slider-thumb]:cursor-pointer',
    '[&::-webkit-slider-thumb]:shadow-sm',
    '[&::-webkit-slider-runnable-track]:bg-transparent',
    '[&::-moz-range-thumb]:border-0',
    '[&::-moz-range-thumb]:w-4',
    '[&::-moz-range-thumb]:h-4',
    '[&::-moz-range-thumb]:rounded-full',
    '[&::-moz-range-thumb]:bg-primary',
    '[&::-moz-range-thumb]:cursor-pointer',
    '[&::-moz-range-track]:bg-transparent',
].join(' ')

export default function CategoryFilters({
    descuento,
    soloStock,
    orden,
    globalMin,
    globalMax,
    currentMin,
    currentMax,
}: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [localMin, setLocalMin] = useState(currentMin)
    const [localMax, setLocalMax] = useState(currentMax)
    const minRef = useRef(currentMin)
    const maxRef = useRef(currentMax)

    useEffect(() => {
        setLocalMin(currentMin)
        setLocalMax(currentMax)
        minRef.current = currentMin
        maxRef.current = currentMax
    }, [currentMin, currentMax])

    const range = globalMax - globalMin || 1

    function pct(value: number) {
        return ((value - globalMin) / range) * 100
    }

    function updateParams(updates: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(updates)) {
            if (value === null) params.delete(key)
            else params.set(key, value)
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    function applyPriceFilter() {
        updateParams({
            precio_min: minRef.current === globalMin ? null : String(minRef.current),
            precio_max: maxRef.current === globalMax ? null : String(maxRef.current),
        })
    }

    const hasAnyFilter = descuento || soloStock || !!orden || currentMin !== globalMin || currentMax !== globalMax
    const hasRangeSlider = globalMin < globalMax

    return (
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-6 sticky top-24">
            <div className="flex items-center justify-between">
                <h3 className="text-label-md font-label-md text-primary uppercase">Filtros</h3>
                {hasAnyFilter && (
                    <button
                        onClick={() => router.push(pathname)}
                        className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {/* Price */}
            <div>
                <h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-3">Precio</h4>

                {hasRangeSlider ? (
                    <>
                        <div className="flex justify-between text-body-sm text-on-surface mb-3">
                            <span>${localMin.toLocaleString('es-AR')}</span>
                            <span>${localMax.toLocaleString('es-AR')}</span>
                        </div>

                        <div className="relative h-5 flex items-center mb-4">
                            {/* Base track */}
                            <div className="absolute w-full h-1.5 rounded-full bg-outline-variant" />
                            {/* Active range fill */}
                            <div
                                className="absolute h-1.5 rounded-full bg-primary"
                                style={{
                                    left: `${pct(localMin)}%`,
                                    width: `${pct(localMax) - pct(localMin)}%`,
                                }}
                            />
                            {/* Min thumb input */}
                            <input
                                type="range"
                                min={globalMin}
                                max={globalMax}
                                step={1}
                                value={localMin}
                                onChange={e => {
                                    const val = Math.min(Number(e.target.value), localMax - 1)
                                    setLocalMin(val)
                                    minRef.current = val
                                }}
                                onPointerUp={applyPriceFilter}
                                style={{ zIndex: localMin > globalMax - range * 0.1 ? 5 : 3 }}
                                className={RANGE_INPUT_CLASS}
                            />
                            {/* Max thumb input */}
                            <input
                                type="range"
                                min={globalMin}
                                max={globalMax}
                                step={1}
                                value={localMax}
                                onChange={e => {
                                    const val = Math.max(Number(e.target.value), localMin + 1)
                                    setLocalMax(val)
                                    maxRef.current = val
                                }}
                                onPointerUp={applyPriceFilter}
                                style={{ zIndex: 4 }}
                                className={RANGE_INPUT_CLASS}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-body-sm text-on-surface-variant mb-4">
                        ${globalMin.toLocaleString('es-AR')}
                    </p>
                )}

                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={descuento}
                        onChange={e => updateParams({ descuento: e.target.checked ? 'true' : null })}
                        className="w-4 h-4 accent-primary"
                    />
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                        Solo con descuento
                    </span>
                </label>
            </div>

            {/* Sort */}
            <div>
                <h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-3">Ordenar por</h4>
                <select
                    value={orden}
                    onChange={e => updateParams({ orden: e.target.value || null })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                    <option value="">Relevancia</option>
                    <option value="precio_asc">Menor precio</option>
                    <option value="precio_desc">Mayor precio</option>
                    <option value="descuento">Mayor descuento</option>
                </select>
            </div>

            {/* Availability */}
            <div>
                <h4 className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-3">Disponibilidad</h4>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={soloStock}
                        onChange={e => updateParams({ stock: e.target.checked ? 'true' : null })}
                        className="w-4 h-4 accent-primary"
                    />
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                        Solo con stock
                    </span>
                </label>
            </div>
        </div>
    )
}
