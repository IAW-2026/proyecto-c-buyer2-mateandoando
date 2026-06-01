'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { useCartStore } from '@/store/cart-store'

export default function Navbar() {
	const pathname = usePathname()
	const { isSignedIn } = useAuth()
	const { user } = useUser()
	const isAdmin = user?.publicMetadata?.role === 'admin-buyer'

	function navLinkClass(href: string) {
		const isActive = pathname.startsWith(href)
		return `transition-colors ${
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
		<header className="sticky top-0 z-50 h-16 bg-surface-container-low border-b border-outline-variant">
			<div className="max-w-[1280px] mx-auto h-full px-10 max-md:px-4 flex items-center justify-between">

				<Link href="/" className="font-heading text-2xl font-semibold text-primary">
					MateandoAndo
				</Link>

				<nav className="hidden md:flex gap-8 text-sm">
					<Link href="/categorias" className={navLinkClass('/categorias')}>Categorías</Link>
					<Link href="/vendedores" className={navLinkClass('/vendedores')}>Vendedores</Link>
					{isSignedIn && (
						<Link href="/mis-compras" className={navLinkClass('/mis-compras')}>Mis Compras</Link>
					)}
					{isAdmin && (
						<Link href="/admin" className={navLinkClass('/admin')}>Admin</Link>
					)}
				</nav>

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
				</div>

			</div>
		</header>
	)
}
