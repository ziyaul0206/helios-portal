"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { RechartsTooltip } from "../tooltip"

interface RechartsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    category: string
    value: number
  }[]
  height?: number
}

export const RechartsBar = ({
  data,
  height = 300,
  ...props
}: RechartsBarProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <RechartsTooltip>
          <strong>{data.category}</strong>
          <span>{Math.round(data.value)}</span>
        </RechartsTooltip>
      )
    }
    return null
  }

  const getXAxisConfig = () => {
    const dataLength = data.length
    const isDense = dataLength > 30

    return {
      interval: "preserveStartEnd" as const,
      minTickGap: isDense ? 40 : 20,
      angle: isDense ? -45 : 0,
      textAnchor: isDense ? "end" : "middle",
      height: isDense ? 60 : 30,
      tickFormatter: (value: string) => value
    }
  }

  const getYAxisDomain = () => {
    const values = data.map((item) => item.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = (max - min) * 0.1
    return [Math.max(0, min - padding), max + padding]
  }

  const xAxisConfig = getXAxisConfig()
  const yAxisDomain = getYAxisDomain()

  return (
    <div {...props} className={props.className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <XAxis
            dataKey="category"
            tick={{ fill: "var(--text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            {...xAxisConfig}
          />
          <YAxis
            domain={yAxisDomain}
            tick={{ fill: "var(--text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => Math.round(value).toString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="var(--color-medium, var(--primary-medium))"
            radius={[4, 4, 0, 0]}
          />
          <CartesianGrid stroke="rgba(0,0,0,.05)" strokeDasharray="5 5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
