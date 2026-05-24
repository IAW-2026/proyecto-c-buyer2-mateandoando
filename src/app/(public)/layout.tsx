import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-10 max-md:px-4 py-8">
            {children}
        </main>
        <Footer />
        </div>
    )
}