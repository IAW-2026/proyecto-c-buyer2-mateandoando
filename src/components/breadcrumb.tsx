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
		<nav aria-label="Hilo de navegación" className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-6">
			{items.map((item, index) => {
				const isLast = index === items.length - 1
				return (
					<Fragment key={index}>
						{index > 0 && <span aria-hidden="true">/</span>}

						{item.href ? (
							<Link href={item.href} className="hover:text-primary transition-colors">
								{item.label}
							</Link>
						) : (
							<span aria-current={isLast ? 'page' : undefined} className="text-on-surface line-clamp-1">
								{item.label}
							</span>
						)}
					</Fragment>
				)
			})}
		</nav>
	)
}
