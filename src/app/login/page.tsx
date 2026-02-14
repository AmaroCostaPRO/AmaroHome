'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { login, signup } from './actions'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sparkles, Mail, Lock, Loader2 } from 'lucide-react'

/* ── Submit Button (usa useFormStatus para loading state) ──── */

function SubmitButton({ label, variant = 'default' }: { label: string; variant?: 'default' | 'outline' }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant={variant} className="w-full h-11" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Aguarde...</span>
        </>
      ) : (
        label
      )}
    </Button>
  )
}

/* ── Login Form (precisa de Suspense por usar useSearchParams) ── */

function LoginForm() {
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get('error')
  const successMessage = searchParams.get('message')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <Card className="w-full max-w-[420px] relative z-10">
      <CardHeader className="text-center pb-2">
        {/* Logo */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-accent" />
        </div>
        <CardTitle className="text-2xl">Hub Pessoal</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Entre na sua conta para continuar'
            : 'Crie uma conta para começar'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error / Success Messages */}
        {errorMessage && (
          <div className="rounded-sm border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form action={mode === 'login' ? login : signup} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-secondary">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-secondary">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="pl-10"
              />
            </div>
          </div>

          <SubmitButton label={mode === 'login' ? 'Entrar' : 'Criar Conta'} />
        </form>

        <Separator />

        {/* Toggle mode */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-muted hover:text-accent transition-colors cursor-pointer"
          >
            {mode === 'login'
              ? 'Não tem conta? Criar agora'
              : 'Já tem conta? Entrar'}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

/* ── Login Page ────────────────────────────────────────────── */

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[420px] h-[500px] glass-card animate-pulse" />
    }>
      <LoginForm />
    </Suspense>
  )
}
