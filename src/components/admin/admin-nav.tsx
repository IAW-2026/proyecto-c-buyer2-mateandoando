'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users } from 'lucide-react'

const links = [
	{ href: '/admin',             label: 'Dashboard',   icon: LayoutDashboard, exact: true  },
	{ href: '/admin/compradores', label: 'Compradores', icon: Users,           exact: false },
]

/**
 * On mobile  → horizontal scrollable strip (border-bottom)
 * On desktop → vertical sidebar (border-right, w-64)
 */
export default function AdminNav() {
	const pathname = usePathname()

	return (
		<aside
			className="
				bg-surface-container-low border-outline-variant
				border-b md:border-b-0 md:border-r
				flex flex-row md:flex-col
				md:w-64 md:flex-shrink-0
			"
		>
			{/* Title — desktop only */}
			<div className="hidden md:flex h-16 items-center px-6 border-b border-outline-variant flex-shrink-0">
				<span className="font-semibold text-primary text-lg">Admin</span>
			</div>

			{/* Links */}
			<nav
				className="flex md:flex-col gap-1 p-2 md:py-4 md:px-3 overflow-x-auto w-full"
				aria-label="Administración"
			>
				{links.map(({ href, label, icon: Icon, exact }) => {
					const isActive = exact ? pathname === href : pathname.startsWith(href)
					return (
						<Link
							key={href}
							href={href}
							className={`
								flex items-center gap-2 md:gap-3
								px-3 py-2 rounded-lg text-sm transition-colors
								whitespace-nowrap flex-shrink-0 md:flex-shrink md:w-full
								${isActive
									? 'bg-primary text-on-primary font-semibold'
									: 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}
							`}
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
