'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AuthForm } from '@/components/auth-form'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-secondary/10" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8 sm:px-6">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/skolarly-logo.png"
              alt="Skolarly"
              width={36}
              height={36}
              className="size-9 object-contain"
            />
            <span className="text-lg font-bold text-primary">Skolarly</span>
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center py-12">
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl shadow-primary/5">
            <AuthForm mode={mode} onModeChange={setMode} />
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to use Skolarly for your personal learning.
          </p>
        </main>
      </div>
    </div>
  )
}
