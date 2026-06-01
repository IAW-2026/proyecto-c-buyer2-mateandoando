'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { useCartStore } from '@/store/cart-store'

export default function Navbar() {
	const pathname = usePathname()
	const { isSignedIn } = useAuth()
	const { user } = useUser()
	const isAdmin = user?.publicMetadata?.role === 'admin-buyer'

	const [isOpen, setIsOpen] = useState(false)

	// Close mobile menu whenever the route changes
	useEffect(() => { setIsOpen(false) }, [pathname])

	function navLinkClass(href: string, mobile = false) {
		const isActive = pathname.startsWith(href)
		const base = mobile
			? 'block px-4 py-3 rounded-lg text-sm font-medium transition-colors'
			: 'transition-colors text-sm'
		return `${base} ${
			isActive
				? 'text-primary underline underline-offset-8 decoration-2 decoration-gray-400'
				: 'text-on-surface hover:text-primary'
		}`
	}

	const count = useCartStore(s => s.count)
	const setCount = useCartStore(s => s.setCount)

	// Initialize count from DB when the user signs in
	useEffect(() => {
		if (!isSignedIn) {
			setCount(0)
			return
		}
		fetch('/api/cart/count')
			.then(res => res.json())
			.then(data => setCount(data.count ?? 0))
			.catch(() => setCount(0))
	}, [isSignedIn])

	return (
		<header className="sticky top-0 z-50 bg-surface-container-low border-b border-outline-variant">
			{/* Main bar */}
			<div className="max-w-[1280px] mx-auto h-16 px-10 max-md:px-4 flex items-center justify-between">

				<Link href="/" className="font-heading text-2xl font-semibold text-primary">
					MateandoAndo
				</Link>

				{/* Desktop nav */}
				<nav className="hidden md:flex gap-8" aria-label="Navegación principal">
					<Link href="/categorias" className={navLinkClass('/categorias')}>Categorías</Link>
					<Link href="/vendedores" className={navLinkClass('/vendedores')}>Vendedores</Link>
					<Link href="/mis-compras" className={navLinkClass('/mis-compras')}>Mis Compras</Link>

					{/* Display admin entry point only if the user is admin */}
					{isAdmin && (
						<Link href="/admin" className={navLinkClass('/admin')}>Admin</Link>
					)}
				</nav>

				{/* Right side: cart + auth + hamburger */}
				<div className="flex items-center gap-4">
					<div role="status" aria-live="polite" aria-atomic="true">
						<Link
							href="/carrito"
							aria-label={count > 0 ? `Carrito, ${count} ${count === 1 ? 'producto' : 'productos'}` : 'Carrito'}
							className="relative text-on-surface hover:text-primary transition-colors"
						>
							<ShoppingCart size={22} aria-hidden="true" />
							{count > 0 && (
								<span aria-hidden="true" className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center leading-none">
									{count > 99 ? '99+' : count}
								</span>
							)}
						</Link>
					</div>

					{isSignedIn ? (
						<UserButton />
					) : (
						<SignInButton mode="modal">
							<button className="bg-primary text-on-primary text-sm font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity">
								Ingresar
							</button>
						</SignInButton>
					)}

					{/* Hamburger — mobile only */}
					<button
						className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
						aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
						aria-expanded={isOpen}
						aria-controls="mobile-nav"
						onClick={() => setIsOpen(prev => !prev)}
					>
						{isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{isOpen && (
				<nav
					id="mobile-nav"
					aria-label="Navegación principal móvil"
					className="md:hidden border-t border-outline-variant bg-surface-container-low px-4 pb-4 pt-2 flex flex-col gap-1"
				>
					<Link href="/categorias" className={navLinkClass('/categorias', true)}>Categorías</Link>
					<Link href="/vendedores" className={navLinkClass('/vendedores', true)}>Vendedores</Link>
					<Link href="/mis-compras" className={navLinkClass('/mis-compras', true)}>Mis Compras</Link>

					{/* Display admin entry point only if the user is admin */}
					{isAdmin && (
						<Link href="/admin" className={navLinkClass('/admin', true)}>Admin</Link>
					)}
				</nav>
			)}
		</header>
	)
}
