"use client"

import { Blocks } from "@/components/blocks"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { truncateAddress } from "@/lib/utils"
import { toast } from "sonner"
import s from "./power.module.scss"

export const Power = () => {
  const address = "0x1234567890123456789012345678901234567890"
  const blocks = [
    {
      title: "Voting Power",
      value: "12,500 votes",
      bottom: "0.25% of total voting power",
      color: "primary"
    },
    {
      title: "Staked HLS",
      value: "2,500 HLS",
      bottom: "Direct voting power"
    },
    {
      title: "Delegated Power",
      value: "10,000 votes",
      bottom: "From validator delegations",
      color: "success"
    }
  ]

  const list = [
    {
      label: "Proposals",
      value: 2
    },
    {
      label: "Votes Cast",
      value: 15
    }
  ]

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    toast.success("Address copied to clipboard")
  }

  return (
    <Card className={s.power} auto>
      <Heading
        icon="hugeicons:renewable-energy"
        title="Your Governance Power"
      />
      <p className={s.description}>
        Participate in on-chain governance by voting on proposals and submitting
        new proposals.
      </p>
      <Blocks items={blocks} />
      <div className={s.wallet}>
        <div className={s.icon}>
          <Icon icon="hugeicons:wallet-01" />
        </div>
        <div className={s.left}>
          <div className={s.title}>Connected Wallet</div>
          <div className={s.address}>
            <span>{truncateAddress(address, 6, 6)}</span>
            <Button
              variant="secondary"
              icon="hugeicons:copy-01"
              border
              className={s.copy}
              onClick={handleCopy}
            />
          </div>
        </div>
        <ul className={s.right}>
          {list.map((item, index) => (
            <li key={index}>
              <div className={s.label}>{item.label}</div>
              <div className={s.value}>{item.value}</div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
