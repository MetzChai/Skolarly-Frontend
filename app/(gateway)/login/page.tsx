'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 600))

    router.push('/skolarly')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-secondary/10" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8 sm:px-6">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
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

        {/* CONTENT */}
        <main className="flex flex-1 flex-col justify-center py-12">

          {/* CARD */}
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl shadow-primary/5">

            {/* HEADER INSIDE CARD */}
            <div className="relative overflow-hidden bg-linear-to-br from-primary/15 via-primary/5 to-secondary/10 px-6 pt-8 pb-6">

              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />

              <div className="relative flex flex-col items-center text-center">
                <Image
                  src="/images/skolarly-logo.png"
                  alt="Skolarly"
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain drop-shadow-sm"
                />

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                  Welcome back
                </h2>

                <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                  Sign in to pick up where you left off
                </p>
              </div>
            </div>

            {/* FORM */}
            <div className="px-6 pt-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* EMAIL */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@school.edu"
                      className="pl-9"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-9 pr-10"
                      required
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>

              </form>

              {/* SWITCH */}
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Sign up free
                </Link>
              </p>
            </div>

          </div>

          {/* FOOTER (OUTSIDE CARD) */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to use Skolarly for your personal learning.
          </p>

        </main>
      </div>
    </div>
  )
}