import './ui/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Manrope, Inter } from 'next/font/google'
import NavigationProgress from '@/components/navigation-progress'

const manrope = Manrope({
      subsets: ['latin'],
      variable: '--font-manrope',
      display: 'swap',
})

const inter = Inter({
      subsets: ['latin'],
      variable: '--font-inter',
      display: 'swap',
})

export const metadata = { title: 'MateandoAndo - Buyer' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
              <ClerkProvider>
                      <html lang="es" className={`${manrope.variable} ${inter.variable}`}>
                              <body>
                                <NavigationProgress />
                                {children}
                        </body>
                      </html>
              </ClerkProvider>
      )
}