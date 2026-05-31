'use client'

import { useState } from 'react'

export type Address = {
	street: string
	floor_apt: string
	city: string
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

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault()
		onSubmit(address)
	}

	return (
		<form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
			<div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-4">
				<h2 className="text-headline-md font-headline-md text-on-surface">
					Dirección de envío
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex flex-col gap-1 sm:col-span-2">
						<label className="text-label-md text-on-surface-variant">
							Calle
						</label>
						<input
							type="text"
							required
							value={address.street}
							onChange={event => setAddress(prev => ({ ...prev, street: event.target.value }))}
							placeholder="Av. Corrientes"
							className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-label-md text-on-surface-variant">
							Piso / Dpto (opcional)
						</label>
						<input
							type="text"
							value={address.floor_apt}
							onChange={event => setAddress(prev => ({ ...prev, floor_apt: event.target.value }))}
							placeholder="3° B"
							className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-label-md text-on-surface-variant">
							Código postal
						</label>
						<input
							type="text"
							required
							value={address.zip_code}
							onChange={
								event => {
											setAddress(prev => ({ ...prev, zip_code: event.target.value }))
											onZipCodeChange(event.target.value)
										}	
							}
							placeholder="1043"
							className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-label-md text-on-surface-variant">
							Ciudad
						</label>
						<input
							type="text"
							required
							value={address.city}
							onChange={event => setAddress(prev => ({ ...prev, city: event.target.value }))}
							placeholder="Buenos Aires"
							className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
						/>
					</div>

					<div className="flex flex-col gap-1 sm:col-span-2">
						<label className="text-label-md text-on-surface-variant">
							Provincia
						</label>
						<input
							type="text"
							required
							value={address.province}
							onChange={event => setAddress(prev => ({ ...prev, province: event.target.value }))}
							placeholder="CABA"
							className="border border-outline-variant rounded-lg px-4 py-3 text-body-md bg-surface text-on-surface focus:outline-none focus:border-primary"
						/>
					</div>
				</div>
			</div>

			{errorMessage && (
				<p className="text-body-sm text-error">
					{errorMessage}
				</p>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-primary text-on-primary py-4 rounded-lg font-semibold text-body-md hover:opacity-90 disabled:opacity-50 transition-opacity"
			>
				{isLoading ? 'Procesando...' : 'Confirmar y pagar'}
			</button>
		</form>
	)
}
