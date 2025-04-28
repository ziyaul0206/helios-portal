"use client"

import clsx from "clsx"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { RechartsTooltip } from "../tooltip"
import s from "./pie.module.scss"

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
          <span>{data.percentage.toFixed(2)}%</span>
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

interface RechartsPieLegendProps {
  data: {
    name: string
    value: number
    color: string
    percentage: number
  }[]
  className?: string
}

export const RechartsPieLegend = ({
  data,
  className
}: RechartsPieLegendProps) => {
  return (
    <div className={clsx(s.legend, className)}>
      {data.map((item, index) => (
        <div key={index} className={s.item}>
          <div className={s.dot} style={{ backgroundColor: item.color }} />
          <span className={s.name}>{item.name}</span>
          <span className={s.value}>${item.value.toLocaleString()}</span>
          <span className={s.percentage}>{item.percentage.toFixed(2)}%</span>
        </div>
      ))}
    </div>
  )
}
