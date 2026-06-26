import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

interface Props {
	reset: () => void
	className?: string
}

export default function ErrorContent({ reset, className }: Props) {
	return (
		<div className={`flex flex-col items-center justify-center px-4 text-center gap-6 ${className ?? ''}`}>
			<AlertCircle size={56} className="text-error opacity-80" aria-hidden="true" />

			<div className="flex flex-col gap-2">
				<h1 className="text-headline-xl font-headline-xl text-on-surface">
					Algo salió mal
				</h1>
				<p className="text-body-lg font-body-lg text-on-surface-variant max-w-md">
					Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
				</p>
			</div>

			<div className="flex flex-col sm:flex-row gap-4">
				<button
					onClick={reset}
					className="bg-primary text-on-primary px-8 py-3 rounded-lg font-semibold text-body-md hover:opacity-90 transition-opacity"
				>
					Intentar de nuevo
				</button>
				<Link
					href="/"
					className="border border-outline-variant text-on-surface px-8 py-3 rounded-lg font-semibold text-body-md hover:bg-surface-container transition-colors"
				>
					Volver al inicio
				</Link>
			</div>
		</div>
	)
}
