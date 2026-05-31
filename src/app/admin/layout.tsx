import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/admin-nav'

export const metadata = { title: 'Admin — MateandoAndo' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const { sessionClaims } = await auth()
	const role = (sessionClaims?.publicMetadata as { role?: string })?.role

	if (role !== 'admin-buyer') {
		redirect('/')
	}

	return (
		<div className="flex min-h-screen bg-surface">
			<AdminNav />
			<main className="flex-1 p-8 overflow-y-auto">
				{children}
			</main>
		</div>
	)
}
