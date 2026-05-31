'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'

const links = [
	{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
	{ href: '/admin/compradores', label: 'Compradores', icon: Users, exact: false },
]

export default function AdminNav() {
	const pathname = usePathname()

	return (
		<aside className="w-64 flex-shrink-0 bg-surface-container-low border-r border-outline-variant flex flex-col min-h-screen">
			<div className="h-16 flex items-center px-6 border-b border-outline-variant">
				<span className="font-semibold text-primary text-lg">🧉 Admin</span>
			</div>

			<nav className="flex-1 py-4 flex flex-col gap-1 px-3">
				{links.map(({ href, label, icon: Icon, exact }) => {
					const isActive = exact ? pathname === href : pathname.startsWith(href)

					return (
						<Link
							key={href}
							href={href}
							className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
								isActive
									? 'bg-primary text-on-primary font-semibold'
									: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
							}`}
						>
							<Icon size={18} aria-hidden="true" />
							{label}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
