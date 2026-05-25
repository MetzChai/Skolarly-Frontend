'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AuthMode = 'login' | 'signup'

interface AuthFormProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  className?: string
  showBranding?: boolean
}

export function AuthForm({
  mode,
  onModeChange,
  className,
  showBranding = true,
}: AuthFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    router.push('/study-hub')
  }

  const switchMode = (next: AuthMode) => {
    onModeChange(next)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {showBranding && (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/10 px-6 pt-8 pb-6">
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
              {mode === 'login' ? 'Welcome back' : 'Join Skolarly'}
            </h2>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              {mode === 'login'
                ? 'Sign in to pick up where you left off'
                : 'Start learning smarter with AI-powered tools'}
            </p>
          </div>
        </div>
      )}

      <div className={cn('px-6', showBranding ? 'pt-6 pb-6' : 'py-2')}>
        {!showBranding && (
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === 'login'
                ? 'Sign in to continue your learning journey'
                : 'Join Skolarly and start learning smarter'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Alex Johnson"
                  className="pl-9"
                  required
                  autoComplete="name"
                />
              </div>
            </div>
          )}

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === 'login' && (
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => {
                    /* placeholder until auth backend exists */
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'login' ? 'Enter your password' : 'At least 8 characters'}
                className="pl-9 pr-10"
                required
                minLength={mode === 'signup' ? 8 : undefined}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className="pl-9 pr-10"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor="remember"
                className="cursor-pointer text-sm font-normal text-muted-foreground"
              >
                Remember me for 30 days
              </Label>
            </div>
          )}

          <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner />
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              <>
                {mode === 'login' ? 'Sign in' : 'Create account'}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        {mode === 'signup' && (
          <ul className="mt-5 space-y-2 rounded-lg border border-border/80 bg-muted/40 px-4 py-3">
            {[
              { icon: BookOpen, text: 'AI lesson explanations' },
              { icon: BrainCircuit, text: 'Personalized quizzes' },
              { icon: MessageSquare, text: '24/7 AI tutor chat' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <Icon className="size-3.5 shrink-0 text-primary" />
                {text}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="font-medium text-primary hover:underline"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
