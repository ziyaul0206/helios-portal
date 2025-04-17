"use client"

import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import clsx from "clsx"
import { useState } from "react"
import s from "./claim.module.scss"
import { ModalClaim } from "./modal"

export const Claim = () => {
  const [open, setOpen] = useState(false)
  const [rewards, setRewards] = useState(71.5)
  const classes = clsx(s.claim, rewards > 0 && s.claimAvailable)

  return (
    <>
      <div className={classes}>
        <h3>Rewards Available</h3>
        <div className={s.available}>
          {rewards} <Icon icon="helios" />
        </div>
        <div className={s.price}>≈${rewards * 100}</div>
        <Button
          icon="helios"
          onClick={() => setOpen(true)}
          variant={rewards > 0 ? "success" : "primary"}
        >
          Claim All Rewards
        </Button>
      </div>
      <ModalClaim
        title="Claim Staking Rewards"
        open={open}
        setOpen={setOpen}
        rewards={rewards}
        setRewards={setRewards}
      />
    </>
  )
}
