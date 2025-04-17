"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { RechartsTooltip } from "../tooltip"

interface RechartsLineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    date: string
    value: number
  }[]
  height?: number
  filters?: {
    period?: "7d" | "30d" | "90d" | "1y" | "daily" | "weekly" | "monthly"
  }
}

export const RechartsLine = ({
  data,
  // filters,
  height = 300,
  ...props
}: RechartsLineProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <RechartsTooltip>
          <strong>{data.date}</strong>
          <span>{data.value}%</span>
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
      tickFormatter: (value: string) => {
        const date = new Date(value)
        if (dataLength <= 7) {
          return date.toLocaleDateString("fr", { weekday: "short" })
        } else if (dataLength <= 30) {
          return date.toLocaleDateString("fr", {
            day: "numeric",
            month: "short"
          })
        } else {
          return date.toLocaleDateString("fr", {
            month: "short",
            year: "2-digit"
          })
        }
      }
    }
  }

  const xAxisConfig = getXAxisConfig()

  return (
    <div {...props} className={props.className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-medium, var(--primary-medium))"
                stopOpacity={0.15}
              />
              <stop
                offset="95%"
                stopColor="var(--color-medium, var(--primary-medium))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            {...xAxisConfig}
          />
          <YAxis
            domain={[99, 100]}
            tick={{ fill: "var(--text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-medium, var(--primary-medium))"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
          <CartesianGrid stroke="rgba(0,0,0,.05)" strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
