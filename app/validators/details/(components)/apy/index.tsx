import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Blocks } from "../blocks"

export const Apy = () => {
  const blocks = [
    {
      title: "Base APY",
      value: "8.5%",
      bottom: "Without Helios Boost"
    },
    {
      title: "Current APY",
      value: "12.75%",
      bottom: "Without current Helios Ratio",
      color: "primary"
    },
    {
      title: "Maximum APY",
      value: "12.75%",
      bottom: "Without optimal Helios Ratio"
    }
  ]

  return (
    <Card auto>
      <Heading icon="hugeicons:shield-energy" title="APY Breakdown & Boost" />
      <Blocks items={blocks} />
    </Card>
  )
}
