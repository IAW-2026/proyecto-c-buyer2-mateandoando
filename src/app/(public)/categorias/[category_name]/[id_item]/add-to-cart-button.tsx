'use client'

import { useState } from 'react'
import { ShoppingCart, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'

interface Props {
    id_item: string
}

type State = 'idle' | 'loading' | 'added' | 'error'

export default function AddToCartButton({ id_item }: Props) {
    const [state, setState] = useState<State>('idle')
    const { openSignIn } = useClerk()
    const config = {
        idle: {
            label: 'Agregar al carrito',
            icon: <ShoppingCart size={20} />,
            className: 'bg-primary-container text-on-primary-fixed hover:opacity-90',
        },
        loading: {
            label: 'Agregando...',
            icon: <Loader2 size={20} className="animate-spin" />,
            className: 'bg-primary-container text-on-primary-fixed opacity-70 cursor-not-allowed',
        },
        added: {
            label: 'Agregado',
            icon: <Check size={20} />,
            className: 'bg-surface-container text-primary',
        },
        error: {
            label: 'Error al agregar',
            icon: <AlertCircle size={20} />,
            className: 'bg-error-container text-on-error-container',
        },
    }
    
    const { label, icon, className } = config[state]

    async function handleClick() {
        setState('loading')
        
        try {
            const res = await fetch('/api/cart/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_item, quantity: 1 }),
            })
            
            if (res.status === 401) {
                setState('idle')
                openSignIn()
                return
            }
            
            if (!res.ok) throw new Error()
                
            setState('added')
            setTimeout(() => setState('idle'), 2000)
        } catch {
            setState('error')
            setTimeout(() => setState('idle'), 2000)
        }
    }
    
    return (
        <button
            onClick={handleClick}
            disabled={state === 'loading'}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-semibold text-body-md transition-all duration-200 ${className}`}
        >
            {icon}
            {label}
        </button>
    )
}