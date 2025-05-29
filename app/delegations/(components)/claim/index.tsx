"use client"

import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import clsx from "clsx"
import { useState } from "react"
import s from "./claim.module.scss"
import { ModalClaim } from "./modal"
import { useDelegationInfo } from "@/hooks/useDelegationInfo"
import { formatNumber } from "@/lib/utils/number"

export const Claim = () => {
  const { totalRewards } = useDelegationInfo()
  const [open, setOpen] = useState(false)
  const [rewards, setRewards] = useState(71.5)
  const classes = clsx(s.claim, rewards > 0 && s.claimAvailable)

  return (
    <>
      <div className={classes}>
        <h3>Rewards Available</h3>
        <div className={s.available}>
          {formatNumber(totalRewards?.amount || 0)} <Icon icon="helios" />
        </div>
        {totalRewards && (
          <div className={s.price}>≈${formatNumber(totalRewards.price)}</div>
        )}
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
        rewards={totalRewards?.amount || 0}
        rewardsPrice={totalRewards?.price || 0}
        setRewards={setRewards}
      />
    </>
  )
}
