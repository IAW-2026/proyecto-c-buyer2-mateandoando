import Link from 'next/link'
import { Package } from 'lucide-react'

export default function EmptyOrders() {
	return (
		<div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
			<Package size={48} className="opacity-40" />
			<p className="text-body-md">Todavía no realizaste ninguna compra.</p>
			<Link
				href="/"
				className="bg-primary text-on-primary px-6 py-3 rounded-lg text-body-md font-semibold hover:opacity-90"
			>
				Ver productos
			</Link>
		</div>
	)
}
