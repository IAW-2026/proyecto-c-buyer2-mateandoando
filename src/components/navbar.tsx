'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs'

export default function Navbar() {
    const { isSignedIn } = useAuth()

    return (
        <header className="sticky top-0 z-50 h-16 bg-surface-container-low border-b border-outline-variant">
            <div className="max-w-[1280px] mx-auto h-full px-10 max-md:px-4 flex items-center justify-between">

                <Link href="/" className="font-heading text-2xl font-semibold text-primary">
                    MateandoAndo
                </Link>

                <nav className="hidden md:flex gap-8 text-sm text-on-surface-variant">
                    <Link href="/categorias" className="hover:text-primary transition-colors">Categorías</Link>
                    <Link href="/vendedores" className="hover:text-primary transition-colors">Vendedores</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/carrito" className="text-on-surface hover:text-primary transition-colors">
                        <ShoppingCart size={22} />
                    </Link>

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