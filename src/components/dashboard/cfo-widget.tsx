'use client'

import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useBentoGrid } from './bento-grid'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from 'recharts'

interface CFOWidgetProps {
  data: {
    monthBalance: number
    monthIncome: number
    monthExpense: number
  }
}

export function CFOWidget({ data }: CFOWidgetProps) {
  const { expandedId } = useBentoGrid()
  // Ensure we compare with the string id 'finance'
  const isExpanded = expandedId === 'finance'

  // Simulação de dados semanais para o gráfico (distribuição aleatória baseada na renda)
  const chartData = [
    { name: 'S1', value: data.monthIncome * 0.2 },
    { name: 'S2', value: data.monthIncome * 0.25 },
    { name: 'S3', value: data.monthIncome * 0.15 },
    { name: 'S4', value: data.monthIncome * 0.4 },
  ]

  return (
    <div className="h-full flex flex-col justify-between relative">
      <div className="space-y-1 z-10">
        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Saldo Atual</p>
        <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          {formatCurrency(data.monthBalance)}
        </p>
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between text-sm group">
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-emerald-300 transition-colors">
            <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <span>Receitas</span>
          </div>
          <span className="font-semibold text-emerald-400 text-lg">{formatCurrency(data.monthIncome)}</span>
        </div>

        <div className="flex items-center justify-between text-sm group">
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-rose-300 transition-colors">
            <div className="p-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <span>Despesas</span>
          </div>
          <span className="font-semibold text-rose-400 text-lg">{formatCurrency(data.monthExpense)}</span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 160 }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-6"
          >
            <div className="h-full w-full pt-4 border-t border-indigo-500/10">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Fluxo Mensal (Estimado)</p>
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                      formatter={(value: number | undefined) => [formatCurrency(value || 0), 'Valor']}
                      labelStyle={{ display: 'none' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
