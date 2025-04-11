import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Blocks } from "../blocks"

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

  return (
    <Card auto>
      <Heading icon="hugeicons:chart-up" title="Performance History" />
      <Blocks items={blocks} />
    </Card>
  )
}
