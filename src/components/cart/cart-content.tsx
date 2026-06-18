'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'

type CartItem = {
    id_cart_item: string
    id_item: string
    quantity: number
    product: {
        id_item: string
        name: string
        price: number
        description: string
        category_name: string
        id_seller: string
        seller_name: string
        discount_pct: number
        image_url: string | null
    }
}

interface Props {
    initialItems: CartItem[]
}

export default function CartContent({ initialItems }: Props) {
    const [items, setItems] = useState<CartItem[]>(initialItems)
    const increment = useCartStore(s => s.increment)
    const decrement = useCartStore(s => s.decrement)

    const subtotal = items.reduce(
        (acc, item) => acc + effectivePrice(item) * item.quantity, 0
    )
    
    async function updateQuantity(id_cart_item: string, newQuantity: number) {
        if (newQuantity < 1) return

        const current = items.find(i => i.id_cart_item === id_cart_item)
        if (!current) return

        const delta = newQuantity - current.quantity
        const previous = items

        setItems(prev =>
            prev.map(item =>
                item.id_cart_item === id_cart_item ? { ...item, quantity: newQuantity } : item
            )
        )
        if (delta > 0) increment(delta)
        else if (delta < 0) decrement(-delta)

        const res = await fetch(`/api/cart/items/${id_cart_item}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity }),
        })

        if (!res.ok) {
            setItems(previous)
            if (delta > 0) decrement(delta)
            else if (delta < 0) increment(-delta)
        }
    }

    async function removeItem(id_cart_item: string) {
        const current = items.find(i => i.id_cart_item === id_cart_item)
        const removedQty = current?.quantity ?? 1
        const previous = items

        setItems(prev => prev.filter(item => item.id_cart_item !== id_cart_item))
        decrement(removedQty)

        const res = await fetch(`/api/cart/items/${id_cart_item}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            setItems(previous)
            increment(removedQty)
        }
    }
    
    function effectivePrice(item: CartItem) {
        return item.product.discount_pct > 0
        ? Math.round(item.product.price * (1 - item.product.discount_pct / 100)) // TODO: Test this
        : item.product.price
    }
    
    if (items.length === 0) {
        // Cart is empty

        return (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
                    <p className="text-body-md">
                        Tu carrito está vacío.
                    </p>
                    <Link
                        href="/"
                        className="bg-primary text-on-primary px-6 py-3 rounded-lg text-body-md font-semibold hover:opacity-90"
                    >
                        Ver productos
                    </Link>
            </div>
        )
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
            {/* Items list */}
            <div className="lg:col-span-8 flex flex-col divide-y divide-outline-variant">
                {items.map((item) => {
                const price = effectivePrice(item)
                return (
                    <div key={item.id_cart_item} className="flex items-center gap-4 py-5">
                    
                        {/* Image */}
                        <div className="w-20 h-20 rounded-lg bg-surface-container flex-shrink-0 border border-outline-variant overflow-hidden relative">
                            {item.product.image_url ? (
                                <Image
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            ) : (
                                <span className="w-full h-full flex items-center justify-center text-2xl font-bold text-outline opacity-30">
                                    {item.product.name[0]}
                                </span>
                            )}
                        </div>
                    
                        {/* Info */}
                        <div className="flex-grow min-w-0">
                            <p className="text-body-md font-semibold text-on-surface truncate">
                            {item.product.name}
                            </p>

                            <p className="text-label-sm text-on-surface-variant">
                                {item.product.seller_name}
                            </p>
                    
                            <p className="text-body-md font-bold text-primary mt-1">
                                ${price.toLocaleString('es-AR')}
                            </p>
                        </div>
                
                        {/* Quantity stepper */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => updateQuantity(item.id_cart_item, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center transition-colors"
                                aria-label="Reducir cantidad"
                            >
                                <Minus size={14} />
                            </button>
                        
                            <span className="w-8 text-center text-body-md select-none">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(item.id_cart_item, item.quantity + 1)}
                                className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center transition-colors"
                                aria-label="Aumentar cantidad"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    
                        {/* Line total */}
                        <p className="w-28 text-right text-body-md font-bold text-on-surface flex-shrink-0">
                            ${(price * item.quantity).toLocaleString('es-AR')}
                        </p>
                    
                        {/* Delete */}
                        <button
                            onClick={() => removeItem(item.id_cart_item)}
                            className="text-on-surface-variant hover:text-error transition-colors p-1 flex items-center justify-center"
                            aria-label={`Eliminar ${item.product.name}`}
                        >
                            <Trash2 size={18} />
                        </button>
                
                    </div>
                )   
                })}
            </div>
        
            {/* Order summary */}
            <div className="lg:col-span-4">
                <div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-4 sticky top-6">
                    <h2 className="text-headline-md font-headline-md text-on-surface">
                        Resumen
                    </h2>
                
                    <div className="flex justify-between text-body-md text-on-surface-variant">
                        <span>
                            {items.length} {items.length === 1 ? 'producto' : 'productos'}
                        </span>
                        
                        <span>
                            ${subtotal.toLocaleString('es-AR')}
                        </span>
                    </div>
            
                    <div className="flex justify-between text-body-sm text-on-surface-variant border-t border-outline-variant pt-4">
                        <span>
                            Envío
                        </span>
                        <span>
                            Se calcula en el checkout
                        </span>
                    </div>
            
                    <div className="flex justify-between text-headline-md font-headline-md text-on-surface border-t border-outline-variant pt-4">
                        <span>
                            Total estimado
                        </span>
                        <span>
                            ${subtotal.toLocaleString('es-AR')}
                        </span>
                    </div>
                
                    <Link
                        href="/checkout"
                        className="w-full bg-primary text-on-primary text-center py-4 rounded-lg font-semibold text-body-md hover:opacity-90"
                    >
                        Ir al checkout
                    </Link>
                
                    <Link
                        href="/"
                        className="text-center text-body-sm text-primary hover:underline"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </div>
    )
}