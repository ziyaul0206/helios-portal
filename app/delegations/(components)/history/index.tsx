"use client"

import { Blocks } from "@/components/blocks"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { RechartsLine } from "@/components/recharts/line"
import { generatePerformanceData } from "@/lib/faker"
import clsx from "clsx"
import { useState } from "react"
import s from "./history.module.scss"

export const History = () => {
  const blocks = [
    {
      title: "Daily Average",
      value: (
        <>
          2.99 <Icon icon="helios" />
        </>
      ),
      color: "success"
    },
    {
      title: "Weekly Average",
      value: (
        <>
          20.93 <Icon icon="helios" />
        </>
      ),
      color: "success"
    },
    {
      title: "Monthly Average",
      value: (
        <>
          89.69 <Icon icon="helios" />
        </>
      ),
      color: "success"
    }
  ]

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const data = generatePerformanceData(
    period === "daily"
      ? 7
      : period === "weekly"
      ? 30
      : period === "monthly"
      ? 90
      : 365
  )

  return (
    <Card className={s.history} auto>
      <Heading icon="hugeicons:chart-up" title="Rewards History" />
      <Blocks items={blocks} />
      <div className={s.chart}>
        <div className={s.title}>
          <h3>Rewards History</h3>
          <div className={s.filters}>
            {(["daily", "weekly", "monthly"] as const).map((value) => (
              <Button
                key={value}
                variant="secondary"
                size="xsmall"
                onClick={() => setPeriod(value)}
                className={clsx(period === value && s.active)}
                isActive={period === value}
                classNameActive={s.active}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <RechartsLine
          data={data}
          filters={{ period }}
          className={s.lines}
          data-color="success"
        />
      </div>
    </Card>
  )
}
