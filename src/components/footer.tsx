import Link from 'next/link'

export default function Footer() {
	return (
		<footer className="w-full mt-auto py-8 bg-surface-container-high border-t border-outline-variant">
			<div className="max-w-7xl mx-auto px-10 max-md:px-4 flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="flex flex-col items-center md:items-start gap-1">
					<span className="font-headline-md text-headline-md text-primary">
						MateandoAndo
					</span>
					<p className="text-label-sm font-label-sm text-on-surface text-center md:text-left">
						© 2026 MateandoAndo. Buyer-App.
					</p>
				</div>

				<div className="flex flex-wrap justify-center gap-6">
					<Link href="/categorias" className="text-on-surface hover:text-primary transition-colors text-label-sm font-label-sm">Categorías</Link>
					<Link href="/vendedores" className="text-on-surface hover:text-primary transition-colors text-label-sm font-label-sm">Vendedores</Link>
				</div>
			</div>
		</footer>
	)
}
