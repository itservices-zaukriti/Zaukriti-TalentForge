import './globals.css'
import { Inter, Outfit } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata = {
    metadataBase: new URL('https://zaukriti.ai'),
    title: 'Zaukriti.ai — Build. Prove. Belong.',
    description: 'A merit-first virtual hackathon to identify real builders for AI & digital platforms.',
    openGraph: {
        title: 'Zaukriti.ai — Build. Prove. Belong.',
        description: 'A merit-first virtual hackathon to identify real builders for AI & digital platforms.',
        images: ['/banner-og.png'], // Placeholder for premium banner
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Zaukriti.ai — Build. Prove. Belong.',
        description: 'A merit-first virtual hackathon to identify real builders for AI & digital platforms.',
        images: ['/banner-og.png'],
    },
}

import Navbar from './components/Navbar'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    )
}
