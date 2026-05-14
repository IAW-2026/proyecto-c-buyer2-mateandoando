import './ui/globals.css';

export const metadata = {
  title: 'MateandoAndo - Buyer'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
