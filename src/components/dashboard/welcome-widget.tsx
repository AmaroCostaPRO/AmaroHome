'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function WelcomeWidget({ userName }: { userName: string }) {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Avoid synchronous setState warning
    const timer = setTimeout(() => {
      const hour = new Date().getHours()
      if (hour < 12) setGreeting('Bom dia')
      else if (hour < 18) setGreeting('Boa tarde')
      else setGreeting('Boa noite')
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-full flex flex-col justify-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-white/60">
          {greeting}, {userName}.
        </h1>
        <p className="text-lg text-muted-foreground">O que vamos criar hoje?</p>
      </div>

      <div className="relative max-w-xl group">
        <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex items-center bg-slate-950 rounded-lg p-1">
          <Search className="w-5 h-5 text-muted-foreground ml-3 mr-2" />
          <Input
            className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 text-base h-12"
            placeholder="Pergunte algo à IA ou pesquise..."
          />
          <Button size="icon" variant="ghost" className="hover:bg-indigo-500/20 hover:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
