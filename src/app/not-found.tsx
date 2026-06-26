import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function NotFound() {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />

			<main className="flex-grow flex flex-col items-center justify-center px-4 text-center gap-6">
				<p className="text-8xl font-bold text-primary opacity-20 select-none">
					404
				</p>

				<div className="flex flex-col gap-2 -mt-4">
					<h1 className="text-headline-xl font-headline-xl text-on-surface">
						Página no encontrada
					</h1>
					<p className="text-body-lg font-body-lg text-on-surface-variant max-w-md">
						La página que buscás no existe o fue movida.
					</p>
				</div>

				<Link
					href="/"
					className="bg-primary text-on-primary px-8 py-3 rounded-lg font-semibold text-body-md hover:opacity-90 transition-opacity"
				>
					Volver al inicio
				</Link>
			</main>

			<Footer />
		</div>
	)
}
