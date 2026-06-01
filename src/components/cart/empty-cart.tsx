import Link from 'next/link'

export default function EmptyCart() {
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