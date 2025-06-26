"use client"

import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import { Modal } from "@/components/modal"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import s from "./claim.module.scss"
import { formatNumber } from "@/lib/utils/number"
import { useRewards } from "@/hooks/useRewards"
import { Message } from "@/components/message"

interface ModalClaimProps {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
  rewards: number
  rewardsPrice: number
  validatorAddress?: string
}

export const ModalClaim = ({
  title,
  open,
  setOpen,
  rewards,
  rewardsPrice,
  validatorAddress
}: // setRewards
ModalClaimProps) => {
  const [loading, setLoading] = useState(false)
  const classes = clsx(s.claim, rewards > 0 && s.claimAvailable)
  const { claimRewards, claimValidatorRewards, feedback } = useRewards()

  const handleClaim = async () => {
    setLoading(true)
    if (validatorAddress) {
      await claimValidatorRewards(validatorAddress)
    } else {
      await claimRewards()
    }
    setLoading(false)
    toast.success("Rewards claimed successfully!")
  }

  useEffect(() => {
    if (!open) {
      setLoading(false)
    }
  }, [open])

  return (
    <Modal
      title={title}
      onClose={() => setOpen(false)}
      open={open}
      className={s.modal}
      responsiveBottom
    >
      <div className={classes}>
        <h3>Available Rewards</h3>
        <div className={s.available}>
          {formatNumber(rewards)} <Icon icon="helios" />
        </div>
        <div className={s.price}>≈${formatNumber(rewardsPrice)}</div>
      </div>
      <Button
        icon={loading ? "svg-spinners:6-dots-rotate" : "helios"}
        variant={rewards > 0 ? "success" : "primary"}
        onClick={handleClaim}
        disabled={rewards <= 0 || loading}
      >
        {loading ? "Claiming..." : "Claim Rewards"}
      </Button>
      {feedback && feedback.message !== "" && (
        <Message title="Rewards feedback" variant={feedback.status}>
          {feedback.message}
        </Message>
      )}
      {/* <Message
        icon="hugeicons:information-circle"
        title="About Claiming Rewards"
        className={s.message}
      >
        Your rewards have been claimed successfully. You can now see your
        rewards in your wallet.
      </Message> */}
    </Modal>
  )
}
