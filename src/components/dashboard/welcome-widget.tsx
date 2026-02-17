'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useBentoGrid } from './bento-grid'
import { motion, AnimatePresence } from 'framer-motion'

export function WelcomeWidget({ userName }: { userName: string }) {
  const [greeting, setGreeting] = useState('')
  const { expandedId, setExpandedId } = useBentoGrid()
  const [query, setQuery] = useState('')
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isExpanded = expandedId === 'welcome'

  useEffect(() => {
    // Avoid synchronous setState warning and hydration mismatch
    const timer = setTimeout(() => {
      const hour = new Date().getHours()
      if (hour < 12) setGreeting('Bom dia')
      else if (hour < 18) setGreeting('Boa tarde')
      else setGreeting('Boa noite')
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return

    if (!isExpanded) setExpandedId('welcome')
    setLoading(true)
    setAiResult(null)

    // Simulate AI response
    setTimeout(() => {
      setAiResult(`Aqui está uma resposta simulada para: "${query}". \n\n Esta área expandida permite exibir resultados complexos, tabelas ou insights gerados pela IA sem sair do contexto do dashboard using o container de output dedicado.`)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="h-full flex flex-col justify-center relative w-full">
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'mb-4' : 'mb-8'}`}>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-white/60">
          {greeting}, {userName}.
        </h1>
        <p className="text-lg text-slate-400 mt-2 font-light">O que vamos criar hoje?</p>
      </div>

      <div className={`relative max-w-2xl w-full group transition-all duration-300 ${isExpanded ? 'w-full max-w-full' : ''}`}>
        <div className={`absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500 ${isExpanded ? 'opacity-50' : ''}`}></div>
        <form onSubmit={handleSubmit} className="relative flex items-center bg-slate-950/80 backdrop-blur-xl rounded-xl p-2 border border-white/10">
          <Search className="w-5 h-5 text-indigo-400 ml-3 mr-3 shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (!isExpanded) setExpandedId('welcome')
            }}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-slate-500 text-lg h-12 flex-1 text-slate-200"
            placeholder="Pergunte algo à IA ou pesquise..."
          />
          <Button 
            type="submit" 
            size="icon" 
            variant="ghost" 
            className="hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg shrink-0"
            disabled={loading}
          >
            {loading ? <Sparkles className="w-5 h-5 animate-pulse text-indigo-400" /> : <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>
      </div>

      {/* Output Container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-6 border-t border-indigo-500/20 pt-4 overflow-hidden flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
              {loading ? (
                <div className="flex items-center gap-3 text-slate-400 py-4">
                  <Sparkles className="w-5 h-5 animate-spin text-indigo-400" />
                  <span>Pensando...</span>
                </div>
              ) : aiResult ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{aiResult}</p>
                </div>
              ) : (
                <div className="text-slate-500 italic py-4">
                  Os resultados da sua pesquisa aparecerão aqui.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
