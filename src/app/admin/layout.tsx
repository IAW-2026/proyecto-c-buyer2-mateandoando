import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import AdminNav from '@/components/admin/admin-nav'

export const metadata = { title: 'Admin — MateandoAndo' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const user = await currentUser()
	const role = user?.publicMetadata?.role

	if (role !== 'admin-buyer') {
		redirect('/')
	}

	return (
		<div className="flex flex-col min-h-screen bg-surface">
			<Navbar />

			{/*
				flex-col on mobile  → AdminNav (horizontal strip) stacks above main
				flex-row on desktop → AdminNav (sidebar) sits to the left of main
			*/}
			<div className="flex flex-col md:flex-row flex-1 min-h-0">
				<AdminNav />
				<main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
					{children}
				</main>
			</div>
		</div>
	)
}
