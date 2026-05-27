// Success screen after mock payment

import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function MockSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <CheckCircle size={64} className="text-primary" />
        
            <div className="flex flex-col gap-2">
                <h1 className="text-headline-xl font-headline-xl text-primary">
                    ¡Tu Pedido ah sido confirmado!
                </h1>
                <p className="text-body-lg font-body-lg text-on-surface-variant max-w-md">
                    Tu pago fue procesado correctamente. Pronto recibirás novedades sobre el envío.
                </p>
            </div>
        
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/mis-compras"
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg font-semibold text-body-md hover:opacity-90"
                >
                    Ver mis compras
                </Link>

                <Link
                    href="/"
                    className="border border-outline-variant text-on-surface px-8 py-3 rounded-lg font-semibold text-body-md hover:bg-surface-container"
                >
                    Seguir comprando
                </Link>
            </div>
        
            <p className="text-label-sm text-on-surface-variant mt-4">
              Pago simulado. Está página es un mock.
            </p>
        </div>
    )
}