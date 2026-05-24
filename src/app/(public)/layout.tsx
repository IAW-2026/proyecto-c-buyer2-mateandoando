import Navbar from '@/components/navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
                <main className="max-w-[1280px] mx-auto px-10 py-8 max-md:px-4">
                    {children}
                </main>
        </>
    )
}