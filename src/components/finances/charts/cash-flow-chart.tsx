'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartDataPoint } from '@/lib/financial-utils'

interface CashFlowChartProps {
  data: ChartDataPoint[]
}



interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; payload: ChartDataPoint }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 text-sm mb-2 font-medium">Dia {label}</p>
        <div className="space-y-1">
          <p className="text-emerald-400 text-sm flex items-center justify-between gap-4">
            <span>Entradas:</span>
            <span className="font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value as number)}
            </span>
          </p>
          <p className="text-rose-400 text-sm flex items-center justify-between gap-4">
            <span>Saídas:</span>
            <span className="font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[1].value as number)}
            </span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  return (
    <div className="w-full h-full min-h-[300px] bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
        <div className="w-1 h-5 bg-indigo-500 rounded-full" />
        Fluxo de Caixa
      </h3>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => 
                new Intl.NumberFormat('pt-BR', { 
                  notation: 'compact', 
                  compactDisplay: 'short' 
                }).format(value)
              }
            />
            <Tooltip cursor={{ fill: '#334155', opacity: 0.2 }} content={<CustomTooltip />} />
            {/* Barras de Income (verde) e Expense (vermelho) lado a lado ou empilhadas? 
                O prompt pede Fluxo de Caixa, geralmente lado a lado ou saldo. 
                Vou colocar lado a lado para clareza. */}
            <Bar 
              dataKey="income" 
              name="Receitas" 
              fill="#34d399" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
            <Bar 
              dataKey="expense" 
              name="Despesas" 
              fill="#f472b6" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
