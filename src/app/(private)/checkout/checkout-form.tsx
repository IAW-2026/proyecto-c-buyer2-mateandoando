'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    }
}

interface Props {
    items: CartItem[]
    id_buyer: string
    shippingCost: number
    shippingDays: number
}

type FormState = 'idle' | 'loading' | 'error'

function effectivePrice(price: number, discount_pct: number): number {
    return discount_pct > 0
    ? Math.round(price * (1 - discount_pct / 100)) //TODO: Add tests
    : price
}

export default function CheckoutForm({ items, id_buyer, shippingCost, shippingDays }: Props) {
    const router = useRouter()
    const [formState, setFormState] = useState<FormState>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    
    const [address, setAddress] = useState({
        street: '',
        floor_apt: '',
        city: '',
        province: '',
        zip_code: '',
    })
    
    const subtotal = items.reduce(
        (count, item) => count + effectivePrice(item.product.price, item.product.discount_pct) * item.quantity, 0
    )

    const total = subtotal + shippingCost
    
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        setFormState('loading')
        setErrorMessage(null)
        
        // fetch ceheckout url
        const response = await fetch('/api/cart/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_buyer,
                address,
                items: items.map(item => ({ id_item: item.id_item, quantity: item.quantity })),
            }),
        })
        
        if (!response.ok) {
            setFormState('error')
            setErrorMessage('Hubo un error al procesar tu pedido. Intentá de nuevo.')
            return
        }
        
        const { checkout_url } = await response.json()
        router.push(checkout_url)
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
            {/* Address form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
                    <h2 className="text-headline-md font-headline-md text-on-surface">
                        Dirección de envío
                    </h2>
                
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 sm:col-span-2">
                            <label className="text-label-md text-on-surface-variant">
                                Calle
                            </label>
                            
                            <input
                                type="text"
                                required
                                value={address.street}
                                onChange={event => setAddress(prev => ({ ...prev, street: event.target.value }))}
                                placeholder="Av. Corrientes"
                                className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                
                        <div className="flex flex-col gap-1">
                            <label className="text-label-md text-on-surface-variant">
                                Piso / Dpto (opcional)
                            </label>

                            <input
                                type="text"
                                value={address.floor_apt}
                                onChange={event => setAddress(prev => ({ ...prev, floor_apt: event.target.value }))}
                                placeholder="3° B"
                                className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                
                        <div className="flex flex-col gap-1">
                            <label className="text-label-md text-on-surface-variant">
                                Código postal
                            </label>
                            <input
                                type="text"
                                required
                                value={address.zip_code}
                                onChange={event => setAddress(prev => ({ ...prev, zip_code: event.target.value }))}
                                placeholder="1043"
                                className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                
                        <div className="flex flex-col gap-1">
                            <label className="text-label-md text-on-surface-variant">
                                Ciudad
                            </label>
                            <input
                                type="text"
                                required
                                value={address.city}
                                onChange={event => setAddress(prev => ({ ...prev, city: event.target.value }))}
                                placeholder="Buenos Aires"
                                className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                
                        <div className="flex flex-col gap-1 sm:col-span-2">
                            <label className="text-label-md text-on-surface-variant">
                                Provincia
                            </label>
                            <input
                                type="text"
                                required
                                value={address.province}
                                onChange={event => setAddress(prev => ({ ...prev, province: event.target.value }))}
                                placeholder="CABA"
                                className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
                
                {errorMessage && (
                    <p className="text-body-sm text-error">
                        {errorMessage}
                    </p>
                )}
                
                <button
                    type="submit"
                    disabled={formState === 'loading'}
                    className="w-full bg-primary text-on-primary py-4 rounded-lg font-semibold text-body-md hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    {formState === 'loading' ? 'Procesando...' : 'Confirmar y pagar'}
                </button>
            </form>
        
            {/* Order summary */}
            <div className="lg:col-span-5">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4 sticky top-6">
                <h2 className="text-headline-md font-headline-md text-on-surface">
                    Resumen del pedido
                </h2>
                
                <div className="flex flex-col divide-y divide-outline-variant">
                    {items.map(item => {
                        const price = effectivePrice(item.product.price, item.product.discount_pct)
                        return (
                            <div key={item.id_cart_item} className="flex justify-between items-center py-3 gap-4">
                                <div className="flex flex-col min-w-0">
                                    <p className="text-body-md text-on-surface truncate">
                                        {item.product.name}
                                    </p>

                                    <p className="text-label-sm text-on-surface-variant">
                                        x{item.quantity}
                                    </p>
                                </div>

                                <p className="text-body-md font-semibold text-on-surface flex-shrink-0">
                                    ${(price * item.quantity).toLocaleString('es-AR')}
                                </p>
                            </div>
                        )
                    })}
                </div>
                
                <div className="flex justify-between text-body-md text-on-surface-variant border-t border-outline-variant pt-4">
                    <span>
                        Subtotal
                    </span>

                    <span>
                        ${subtotal.toLocaleString('es-AR')}
                    </span>
                </div>
                
                <div className="flex justify-between text-body-md text-on-surface-variant">
                    <span>
                        Envío ({shippingDays} días hábiles)
                    </span>
                    <span>
                        ${shippingCost.toLocaleString('es-AR')}
                    </span>
                </div>
                
                <div className="flex justify-between text-headline-md font-headline-md text-on-surface border-t border-outline-variant pt-4">
                    <span>
                        Total
                    </span>
                    
                    <span>
                        ${total.toLocaleString('es-AR')}
                    </span>
                </div>
                </div>
            </div>
        </div>
    )
}