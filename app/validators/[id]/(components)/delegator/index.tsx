import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Message } from "@/components/message"
import { RechartsPie, RechartsPieLegend } from "@/components/recharts/pie"
import { formatNumber } from "@/lib/utils/number"
import s from "./delegator.module.scss"

export const Delegator = () => {
  const data = [
    {
      name: "Retail (<$10k)",
      value: 750000,
      price: 1,
      percentage: 30,
      color: "#00BCD4"
    },
    {
      name: "Medium ($10k-$100k)",
      value: 1000000,
      price: 1,
      percentage: 40,
      color: "#FFC107"
    },
    {
      name: "Whale (>$100k)",
      value: 500000,
      price: 1,
      percentage: 20,
      color: "#9C27B0"
    },
    {
      name: "Self-Stake",
      value: 250000,
      price: 1,
      percentage: 10,
      color: "#E91E63"
    }
  ]

  return (
    <Card auto>
      <Heading icon="hugeicons:pie-chart-02" title="Delegator Breakdown" />
      <div className={s.chart}>
        <RechartsPie data={data} className={s.pie} />
        <RechartsPieLegend data={data} />
      </div>
      <Message icon="hugeicons:user-group-02" title="Unique Delegators">
        <strong className={s.number}>{formatNumber(1458)}</strong>
        Across all supported networks
      </Message>
    </Card>
  )
}
