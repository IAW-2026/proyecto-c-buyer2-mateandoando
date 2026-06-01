'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ChevronDown } from 'lucide-react'

interface Props {
	textQuery?: string
	order?: string
}

export default function SearchControls({ textQuery = '', order = '' }: Props) {
	const router = useRouter()
	const [inputValue, setInputValue] = useState(textQuery)

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const data = new FormData(e.currentTarget)
		const params = new URLSearchParams()
		const query = data.get('textQuery')?.toString().trim()
		const orderValue = data.get('order')?.toString()

		if (query)
			params.set('textQuery', query)

		if (orderValue)
			params.set('order', orderValue)

		const queryString = params.toString()
		router.push(queryString ? `/?${queryString}` : '/')
	}

	function handleClear() {
		setInputValue('')
		const params = new URLSearchParams()
		if (order) params.set('order', order)
		const qs = params.toString()
		router.push(qs ? `/?${qs}` : '/')
	}

	function handleOrderChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const params = new URLSearchParams()
		if (inputValue.trim()) params.set('textQuery', inputValue.trim())
		if (e.target.value) params.set('order', e.target.value)
		const qs = params.toString()
		router.push(qs ? `/?${qs}` : '/')
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
					placeholder="Buscar productos..."
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
					className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
				>
					<Search size={18} aria-hidden="true" />
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
					<option value="price_asc">Menor precio</option>
					<option value="price_desc">Mayor precio</option>
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
