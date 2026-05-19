import './ui/globals.css'
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = { 
    title: 'MateandoAndo - Buyer'
  }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
