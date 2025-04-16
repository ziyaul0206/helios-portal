"use client"

import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Slider } from "@/components/slider"
import s from "./guide.module.scss"

export const Guide = () => {
  const steps = [
    {
      title: "Proposal Submission",
      description:
        "Anyone with the minimum deposit (100 HLS) can submit a governance proposal. Proposals can range from parameter changes to asset additions."
    },
    {
      title: "Voting Period",
      description:
        "Once a proposal is submitted, it enters a 14-day voting period. During this time, all token holders and delegators can cast their votes."
    },
    {
      title: "Implementation",
      description:
        "If a proposal passes (majority Yes votes and meets quorum), it is automatically implemented by the network. Parameter changes take effect immediately."
    }
  ]

  return (
    <Card className={s.guide} auto>
      <Heading icon="hugeicons:bubble-chat-question" title="Governance Guide" />
      <Slider slides={steps} />
    </Card>
  )
}
