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
			<div className="flex flex-1">
				<AdminNav />
				<main className="flex-1 p-8 overflow-y-auto">
					{children}
				</main>
			</div>
		</div>
	)
}
