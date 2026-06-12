import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'aa2b4pe3oj.ufs.sh',
			},
		],
	},
}

export default nextConfig
