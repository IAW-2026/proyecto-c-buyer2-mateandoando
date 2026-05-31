'use client'

import { useEffect } from 'react'
import ErrorContent from '@/components/error/error-content'

interface Props {
	error: Error & { digest?: string }
	reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return <ErrorContent reset={reset} className="min-h-screen" />
}
