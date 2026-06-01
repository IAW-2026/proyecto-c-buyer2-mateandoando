'use client'

import { useEffect } from 'react'
import ErrorContent from '@/components/error/error-content'

interface Props {
	error: Error & { digest?: string }
	reset: () => void
}

export default function PrivateError({ error, reset }: Props) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return <ErrorContent reset={reset} className="py-24" />
}
