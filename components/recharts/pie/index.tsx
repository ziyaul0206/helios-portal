"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { RechartsTooltip } from "../tooltip"

interface RechartsPieProps {
  data: {
    name: string
    value: number
    color: string
    percentage: number
  }[]
  className?: string
}

export const RechartsPie = ({ data, className }: RechartsPieProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <RechartsTooltip>
          <strong>{data.name}</strong>
          <span>${data.value.toLocaleString()}</span>
          <span>{data.percentage}%</span>
        </RechartsTooltip>
      )
    }
    return null
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" aspect={1}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
