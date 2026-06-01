import Link from 'next/link'

interface Props {
	currentPage: number
	totalPages:  number
	prevUrl:     string
	nextUrl:     string
}

const LINK_CLASS     = 'px-4 py-2 text-sm font-medium border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-colors'
const DISABLED_CLASS = 'px-4 py-2 text-sm font-medium border border-outline-variant rounded-lg text-on-surface-variant cursor-not-allowed'

export default function Pagination({ currentPage, totalPages, prevUrl, nextUrl }: Props) {
	if (totalPages <= 1) return null

	return (
		<div className="flex items-center justify-center gap-4 mt-10">
			{currentPage > 1
				? <Link href={prevUrl} className={LINK_CLASS}>← Anterior</Link>
				: <button disabled className={DISABLED_CLASS}>← Anterior</button>
			}

			<span className="text-sm text-on-surface-variant">
				Página {currentPage} de {totalPages}
			</span>

			{currentPage < totalPages
				? <Link href={nextUrl} className={LINK_CLASS}>Siguiente →</Link>
				: <button disabled className={DISABLED_CLASS}>Siguiente →</button>
			}
		</div>
	)
}
