import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
    metadataBase: new URL('https://zaukriti.ai'),
    title: 'Zaukriti AI — Build. Prove. Belong.',
    description: 'A merit-first virtual hackathon to identify real builders for AI & digital platforms.',
    openGraph: {
        title: 'Zaukriti AI — Build. Prove. Belong.',
        description: 'A merit-first virtual hackathon to identify real builders for AI & digital platforms.',
        images: ['/banner-og.png'], // Placeholder
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Zaukriti AI — Build. Prove. Belong.',
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
        <html lang="en" className={inter.variable}>
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    )
}
