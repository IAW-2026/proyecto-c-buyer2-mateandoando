import { Fragment } from 'react'
import Link from 'next/link'

export type BreadcrumbItem = {
	label: string
	href?: string
}

interface Props {
	items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: Props) {
	return (
		<nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-6">
			{items.map((item, index) => (
				<Fragment key={index}>
					{index > 0 && <span>/</span>}

					{item.href ? (
						<Link href={item.href} className="hover:text-primary transition-colors">
							{item.label}
						</Link>
					) : (
						<span className="text-on-surface line-clamp-1">
							{item.label}
						</span>
					)}
				</Fragment>
			))}
		</nav>
	)
}
