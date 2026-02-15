'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartDataPoint } from '@/lib/financial-utils'

interface ExpensesPieChartProps {
  data: ChartDataPoint[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ChartDataPoint }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-lg shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          <p className="text-slate-200 font-medium text-sm">{data.name}</p>
        </div>
        <p className="text-white font-bold text-lg">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.value)}
        </p>
      </div>
    )
  }
  return null
}

export function ExpensesPieChart({ data }: ExpensesPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 flex flex-col">
        <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
          <div className="w-1 h-5 bg-purple-500 rounded-full" />
          Por Categoria
        </h3>
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Sem dados de despesas
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[300px] bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-6 flex flex-col">
      <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-purple-500 rounded-full" />
        Por Categoria
      </h3>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="rgba(0,0,0,0)"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Total ou Legenda Central (Opcional) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="text-xs text-slate-500 font-medium">TOTAL</span>
            <div className="text-white font-bold text-sm">
             {new Intl.NumberFormat('pt-BR', { notation: "compact" }).format(data.reduce((acc, curr) => acc + curr.value, 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {data.slice(0, 4).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-300">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
