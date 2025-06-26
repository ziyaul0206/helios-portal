"use client"

import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import clsx from "clsx"
import { useState } from "react"
import s from "./claim.module.scss"
import { ModalClaim } from "./modal"
import { useDelegationInfo } from "@/hooks/useDelegationInfo"
import { formatNumber } from "@/lib/utils/number"
import { useChainId, useSwitchChain } from "wagmi"
import { HELIOS_NETWORK_ID } from "@/config/app"

export const Claim = () => {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { totalRewards } = useDelegationInfo()
  const [open, setOpen] = useState(false)
  const classes = clsx(
    s.claim,
    totalRewards && totalRewards.amount > 0 && s.claimAvailable
  )

  const handleOpenClaim = () => {
    if (chainId !== HELIOS_NETWORK_ID) {
      switchChain({ chainId: HELIOS_NETWORK_ID })
    }

    setOpen(true)
  }

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
          onClick={handleOpenClaim}
          variant={
            totalRewards && totalRewards.amount > 0 ? "success" : "primary"
          }
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
      />
    </>
  )
}
