import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
	const { userId } = await auth()

	if (userId) {
		const user = await currentUser()
		await db.buyer.upsert({
			where: { clerk_user_id: userId },
			create: {
				clerk_user_id: userId,
				first_name: user?.firstName ?? '',
				last_name: user?.lastName ?? '',
				phone: null,
			},
			update: {},
		})
	}

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
