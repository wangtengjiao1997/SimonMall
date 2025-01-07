import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'] })

export const metadata = {
  title: 'Simon Frontend',
  description: 'Frontend application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
