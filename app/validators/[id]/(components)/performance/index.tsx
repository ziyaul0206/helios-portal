"use client"

import { Blocks } from "@/components/blocks"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Message } from "@/components/message"
import { RechartsLine } from "@/components/recharts/line"
import { generatePerformanceData } from "@/lib/faker"
import clsx from "clsx"
import { useState } from "react"
import s from "./performance.module.scss"

export const Performance = () => {
  const blocks = [
    {
      title: "Average Uptime",
      value: "99.99%",
      bottom: "Last 30 days",
      color: "success"
    },
    {
      title: "Blocks Proposer",
      value: "12,458",
      bottom: "Last 30 days",
      color: "primary"
    },
    {
      title: "Blocks Missed",
      value: "2",
      bottom: "Last 30 days",
      color: "warning"
    }
  ]

  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("7d")
  const data = generatePerformanceData(
    period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365
  )

  return (
    <Card auto>
      <Heading icon="hugeicons:chart-up" title="Performance History" />
      <div className={s.chart}>
        <div className={s.title}>
          <h3>Performance History</h3>
          <div className={s.filters}>
            {(["7d", "30d", "90d", "1y"] as const).map((value) => (
              <Button
                key={value}
                variant="secondary"
                size="xsmall"
                onClick={() => setPeriod(value)}
                className={clsx(period === value && s.active)}
                isActive={period === value}
                classNameActive={s.active}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
        <RechartsLine data={data} filters={{ period }} className={s.lines} />
      </div>
      <Blocks items={blocks} />
      <Message
        icon="hugeicons:checkmark-circle-03"
        title="No Slashing Events"
        variant="success"
      >
        This validator has never been slashed.
      </Message>
    </Card>
  )
}
