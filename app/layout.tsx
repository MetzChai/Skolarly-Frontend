import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'Skolarly - AI Study Companion',
  description: 'Your intelligent study partner powered by AI. Get lesson explanations, generate quizzes, and chat with an AI tutor.',
  keywords: ['AI study', 'education', 'learning', 'quiz generator', 'AI tutor'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <AuthProvider>
        {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
