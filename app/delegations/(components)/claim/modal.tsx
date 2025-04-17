"use client"

import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import { Link } from "@/components/link"
import { Message } from "@/components/message"
import { Modal } from "@/components/modal"
import clsx from "clsx"
import { useState } from "react"
import { toast } from "sonner"
import s from "./claim.module.scss"

interface ModalClaimProps {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
  rewards: number
  setRewards: (rewards: number) => void
}

export const ModalClaim = ({
  title,
  open,
  setOpen,
  rewards,
  setRewards
}: ModalClaimProps) => {
  const [loading, setLoading] = useState(false)
  const classes = clsx(s.claim, rewards > 0 && s.claimAvailable)

  const handleClaim = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setRewards(0)
    setOpen(false)
    setLoading(false)
    toast.success(
      <>
        Rewards claimed successfully!
        <Link href="https://explorer.helios.network/tx/" className={s.link}>
          View on Helios Explorer
        </Link>
      </>
    )
  }

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
          {rewards} <Icon icon="helios" />
        </div>
        <div className={s.price}>≈${rewards * 100}</div>
      </div>
      <Button
        icon={loading ? "svg-spinners:6-dots-rotate" : "helios"}
        variant={rewards > 0 ? "success" : "primary"}
        onClick={handleClaim}
        disabled={rewards <= 0 || loading}
      >
        {loading ? "Claiming..." : "Claim Rewards"}
      </Button>
      <Message
        icon="hugeicons:information-circle"
        title="About Claiming Rewards"
        className={s.message}
      >
        Your rewards have been claimed successfully. You can now see your
        rewards in your wallet.
      </Message>
    </Modal>
  )
}
