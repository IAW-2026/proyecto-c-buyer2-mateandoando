'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationProgress() {
	const pathname = usePathname()
	const [visible, setVisible] = useState(false)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Hide when navigation completes (pathname changed)
	useEffect(() => {
		setVisible(false)
		if (timerRef.current) clearTimeout(timerRef.current)
	}, [pathname])

	// Show on any internal anchor click
	useEffect(() => {
		function onLinkClick(e: MouseEvent) {
			const anchor = (e.target as Element).closest('a')
			if (!anchor) return

			const href = anchor.getAttribute('href') ?? ''
			if (
				!href ||
				href.startsWith('http') ||
				href.startsWith('//') ||
				href.startsWith('#') ||
				href.startsWith('mailto') ||
				href.startsWith('tel') ||
				anchor.target === '_blank'
			) return

			setVisible(true)

			// Safety fallback — hide after 10s if navigation never completes
			if (timerRef.current) clearTimeout(timerRef.current)
			timerRef.current = setTimeout(() => setVisible(false), 10_000)
		}

		document.addEventListener('click', onLinkClick)
		return () => {
			document.removeEventListener('click', onLinkClick)
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [])

	if (!visible) return null

	return (
		<div
			role="progressbar"
			aria-label="Cargando página"
			className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-green-700/20"
		>
			<div
				className="h-full bg-green-700"
				style={{ animation: 'nav-bar 2s ease-out forwards' }}
			/>
		</div>
	)
}
