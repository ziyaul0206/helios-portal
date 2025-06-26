"use client"

import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Slider } from "@/components/slider"
import s from "./guide.module.scss"

export const Guide = () => {
  const steps = [
    {
      title: "Choose a Validator",
      description:
        "Select a validator based on their performance metrics, reputation, and boost status. Featured validators are community-vetted for reliability."
    },
    {
      title: "Stake Your Assets",
      description:
        "Delegate your assets to the selected validator. You can stake multiple asset types including HLS, ETH, BNB, and stablecoins."
    },
    {
      title: "Earn Rewards",
      description:
        "Receive staking rewards automatically every epoch (24 hours). Your APY is affected by the validator's boost status and commission rate."
    }
  ]

  return (
    <Card className={s.guide} auto>
      <Heading icon="hugeicons:bubble-chat-question" title="Staking Guide" />
      <Slider slides={steps} />
    </Card>
  )
}
