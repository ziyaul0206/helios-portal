import { Blocks } from "@/components/blocks"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Claim } from "./claim"
import s from "./top.module.scss"

export const Top = () => {
  const blocks = [
    {
      title: "Total Staked Value",
      value: "$9,000",
      bottom: "Across 2 validators"
    },
    {
      title: "Average APY",
      value: "12.13%",
      bottom: "Weighted average",
      color: "success"
    },
    {
      title: "Unbonding Value",
      value: "$2,500",
      bottom: "Across 2 validators",
      color: "warning"
    }
  ]

  return (
    <Card className={s.main} auto>
      <Heading icon="hugeicons:laurel-wreath-01" title="My Delegations" />
      <div className={s.content}>
        <Blocks items={blocks} className={s.blocks} vertical />
        <Claim />
      </div>
    </Card>
  )
}
