import Link from 'next/link'

interface Props {
	itemCount: number
	subtotal: number
}

export default function OrderSummary({ itemCount, subtotal }: Props) {
	return (
		<div className="lg:col-span-4">
			<div className="bg-surface-container-low rounded-xl border border-outline-variant p-6 flex flex-col gap-4 sticky top-6">
				<h2 className="text-headline-md font-headline-md text-on-surface">
					Resumen
				</h2>

				<div className="flex justify-between text-body-md text-on-surface-variant">
					<span>
						{itemCount} {itemCount === 1 ? 'producto' : 'productos'}
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
	)
}
