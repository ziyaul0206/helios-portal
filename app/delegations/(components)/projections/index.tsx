import { Blocks } from "@/components/blocks"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { Message } from "@/components/message"
import s from "./projections.module.scss"

export const Projections = () => {
  const blocks = [
    {
      title: "Daily Rewards",
      value: (
        <>
          2.99 <Icon icon="helios" />
        </>
      ),
      bottom: "≈$15.00",
      color: "success"
    },
    {
      title: "Weekly Rewards",
      value: (
        <>
          20.93 <Icon icon="helios" />
        </>
      ),
      bottom: "≈$105.00",
      color: "success"
    },
    {
      title: "Monthly Rewards",
      value: (
        <>
          89.69 <Icon icon="helios" />
        </>
      ),
      bottom: "≈$448.00",
      color: "success"
    },
    {
      title: "Yearly Rewards",
      value: (
        <>
          1,091.25 <Icon icon="helios" />
        </>
      ),
      bottom: "≈$5,456.00",
      color: "success"
    }
  ]

  return (
    <Card className={s.projections} auto>
      <Heading icon="helios" title="Rewards Projections" />
      <Blocks items={blocks} className={s.blocks} />
      <Message icon="hugeicons:information-circle" title="About Projections">
        These projections are estimates based on your current staking positions
        and APY rates. Actual rewards may vary based on network conditions,
        validator performance, and changes in APY rates.
      </Message>
    </Card>
  )
}
