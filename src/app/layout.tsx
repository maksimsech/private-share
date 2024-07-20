import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme/provider'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'privateshare',
    description: 'Share your data privately.',
}

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={cn('flex gap-2 flex-col', inter.className)}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <Header />
                    {children}
                </ThemeProvider>
                <Toaster />
            </body>
        </html>
    )
}
