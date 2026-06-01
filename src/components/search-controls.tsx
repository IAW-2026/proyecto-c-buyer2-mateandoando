'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ChevronDown, Loader2 } from 'lucide-react'

interface OrderOption {
	value: string
	label: string
}

const DEFAULT_ORDER_OPTIONS: OrderOption[] = [
	{ value: 'price_asc',  label: 'Menor precio' },
	{ value: 'price_desc', label: 'Mayor precio' },
]

interface Props {
	textQuery?:    string
	order?:        string
	orderOptions?: OrderOption[]
	basePath?:     string
}

export default function SearchControls({
	textQuery    = '',
	order        = '',
	orderOptions = DEFAULT_ORDER_OPTIONS,
	basePath     = '/',
}: Props) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [inputValue, setInputValue] = useState(textQuery)

	function navigate(url: string) {
		startTransition(() => router.push(url))
	}

	function buildUrl(query: string, order: string, page?: number) {
		const params = new URLSearchParams()
		
		if (query.trim())
			params.set('textQuery', query.trim())

		if (order)
			params.set('order', order)

		if (page && page > 1)
			params.set('page', String(page))

		const queryString = params.toString()

		return queryString ? `${basePath}?${queryString}` : basePath
	}

	function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault()

		const data = new FormData(e.currentTarget)
		const query = data.get('textQuery')?.toString() ?? ''
		const order = data.get('order')?.toString() ?? ''

		navigate(buildUrl(query, order))
	}

	function handleClear() {
		setInputValue('')
		navigate(buildUrl('', order))
	}

	function handleOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
		navigate(buildUrl(inputValue, e.target.value))
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-3 w-full">
			{/* Search input */}
			<div className="relative flex-1">
				<input
					name="textQuery"
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Buscar..."
					className={`w-full border border-outline-variant rounded-lg bg-surface-container-low px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary ${inputValue ? 'pr-20' : 'pr-12'}`}
				/>

				{/* Clear button — only when there is text */}
				{inputValue && (
					<button
						type="button"
						onClick={handleClear}
						aria-label="Limpiar búsqueda"
						className="absolute right-10 top-1/2 -translate-y-1/2 text-error hover:opacity-70 transition-opacity"
					>
						<X size={16} aria-hidden="true" />
					</button>
				)}

				{/* Search submit button */}
				<button
					type="submit"
					aria-label="Buscar"
					disabled={isPending}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
				>
					{isPending
						? <Loader2 size={18} className="animate-spin" aria-hidden="true" />
						: <Search size={18} aria-hidden="true" />
					}
				</button>
			</div>

			{/* Order-by select with custom arrow */}
			<div className="relative">
				<select
					name="order"
					defaultValue={order}
					onChange={handleOrderChange}
					className="appearance-none border border-outline-variant rounded-lg bg-surface-container-low pl-3 pr-10 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer h-full"
				>
					<option value="">Ordenar por</option>
					{orderOptions.map(opt => (
						<option key={opt.value} value={opt.value}>{opt.label}</option>
					))}
				</select>
				<ChevronDown
					size={16}
					aria-hidden="true"
					className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
				/>
			</div>
		</form>
	)
}
