import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] bg-primary text-on-primary px-4 py-2 rounded"
			>
				Saltar al contenido
			</a>
			<Navbar />
			<main id="main-content" tabIndex={-1} className="flex-grow max-w-7xl w-full mx-auto px-10 max-md:px-4 py-8">
				{children}
			</main>
			<Footer />
		</div>
	)
}
