'use client'

import { useState, useRef } from 'react'
import { Loader2 } from 'lucide-react'

export type Address = {
	street:   string
	floor_apt: string
	city:     string
	province: string
	zip_code: string
}

interface Props {
	onSubmit: (address: Address) => void
	onZipCodeChange: (zip_code: string) => void
	isLoading: boolean
	errorMessage: string | null
}

export default function AddressForm({ onSubmit, onZipCodeChange, isLoading, errorMessage }: Props) {
	const [address, setAddress] = useState<Address>({
		street: '',
		floor_apt: '',
		city: '',
		province: '',
		zip_code: '',
	})

	const [isResolvingLocation, setIsResolvingLocation] = useState(false)
	const [locationError, setLocationError] = useState<string | null>(null)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	function handleZipChange(zip: string) {
		setAddress(prev => ({ ...prev, zip_code: zip }))
		onZipCodeChange(zip) // existing hook (shipping estimate)
		setLocationError(null)

		if (debounceRef.current)
			clearTimeout(debounceRef.current)

		if (zip.trim().length < 4) {
			setIsResolvingLocation(false)
			return
		}

		setIsResolvingLocation(true)

		debounceRef.current = setTimeout(async () => {
			try {
				const res = await fetch(`/api/geo/localidad?cp=${encodeURIComponent(zip.trim())}`)

				if (!res.ok) {
					setLocationError('No se encontró el código postal')
					return
				}

				const { city, province } = await res.json()
				setAddress(prev => ({ ...prev, city, province }))
			} catch {
				setLocationError('Error al buscar el código postal')
			} finally {
				setIsResolvingLocation(false)
			}
		}, 600) // timeout of 600ms
	}

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault()
		onSubmit(address)
	}

	const inputClass = 'border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary w-full'

	return (
		<form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
			<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
				<h2 className="text-headline-md font-headline-md text-on-surface">
					Dirección de envío
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

					{/* Street */}
					<div className="flex flex-col gap-1 sm:col-span-2">
						<label htmlFor="address-street" className="text-label-md text-on-surface-variant">
							Calle
						</label>
						<input
							id="address-street"
							type="text"
							required
							aria-required="true"
							autoComplete="street-address"
							value={address.street}
							onChange={e => setAddress(prev => ({ ...prev, street: e.target.value }))}
							placeholder="Av. Corrientes 1234"
							className={inputClass}
						/>
					</div>

					{/* Floor / Apt */}
					<div className="flex flex-col gap-1">
						<label htmlFor="address-floor" className="text-label-md text-on-surface-variant">
							Piso / Dpto (opcional)
						</label>
						<input
							id="address-floor"
							type="text"
							autoComplete="address-line2"
							value={address.floor_apt}
							onChange={e => setAddress(prev => ({ ...prev, floor_apt: e.target.value }))}
							placeholder="3° B"
							className={inputClass}
						/>
					</div>

					{/* Zip code */}
					<div className="flex flex-col gap-1">
						<label htmlFor="address-zip" className="text-label-md text-on-surface-variant">
							Código postal
						</label>
						<input
							id="address-zip"
							type="text"
							required
							aria-required="true"
							autoComplete="postal-code"
							inputMode="numeric"
							value={address.zip_code}
							onChange={e => handleZipChange(e.target.value)}
							placeholder="1043"
							className={inputClass}
						/>
						{locationError && (
							<p className="text-label-sm text-error mt-0.5">{locationError}</p>
						)}
					</div>

					{/* City — auto-filled from zip */}
					<div className="flex flex-col gap-1">
						<label htmlFor="address-city" className="text-label-md text-on-surface-variant">
							Ciudad
						</label>
						<div className="relative">
							<input
								id="address-city"
								type="text"
								required
								aria-required="true"
								autoComplete="address-level2"
								value={address.city}
								onChange={e => setAddress(prev => ({ ...prev, city: e.target.value }))}
								placeholder="Buenos Aires"
								className={`${inputClass} ${isResolvingLocation ? 'pr-10 text-on-surface-variant' : ''}`}
							/>
							{isResolvingLocation && (
								<Loader2
									size={16}
									aria-hidden="true"
									className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-on-surface-variant"
								/>
							)}
						</div>
					</div>

					{/* Province — auto-filled from zip */}
					<div className="flex flex-col gap-1 sm:col-span-2">
						<label htmlFor="address-province" className="text-label-md text-on-surface-variant">
							Provincia
						</label>
						<div className="relative">
							<input
								id="address-province"
								type="text"
								required
								aria-required="true"
								autoComplete="address-level1"
								value={address.province}
								onChange={e => setAddress(prev => ({ ...prev, province: e.target.value }))}
								placeholder="CABA"
								className={`${inputClass} ${isResolvingLocation ? 'pr-10 text-on-surface-variant' : ''}`}
							/>
							{isResolvingLocation && (
								<Loader2
									size={16}
									aria-hidden="true"
									className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-on-surface-variant"
								/>
							)}
						</div>
					</div>

				</div>
			</div>

			<div role="alert" aria-live="assertive">
				{errorMessage && (
					<p className="text-body-sm text-error">{errorMessage}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isLoading}
				aria-busy={isLoading}
				className="w-full bg-primary text-on-primary py-4 rounded-lg font-semibold text-body-md hover:opacity-90 disabled:opacity-50 transition-opacity"
			>
				{isLoading ? 'Procesando...' : 'Confirmar y pagar'}
			</button>
		</form>
	)
}
