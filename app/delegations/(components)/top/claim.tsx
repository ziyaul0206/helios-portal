"use client"

import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import { Link } from "@/components/link"
import { Message } from "@/components/message"
import { Modal } from "@/components/modal"
import clsx from "clsx"
import { useState } from "react"
import { toast } from "sonner"
import s from "./top.module.scss"

export const Claim = () => {
  const [open, setOpen] = useState(false)
  const [rewards, setRewards] = useState(71.5)
  const classes = clsx(s.claim, rewards > 0 && s.claimAvailable)

  const handleClaim = () => {
    setRewards(0)
    setOpen(false)
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
    <>
      <div className={classes}>
        <h3>Rewards Available</h3>
        <div className={s.available}>
          {rewards} <Icon icon="helios" />
        </div>
        <div className={s.price}>≈$1,000</div>
        <Button
          icon="helios"
          onClick={() => setOpen(true)}
          variant={rewards > 0 ? "success" : "primary"}
        >
          Claim All Rewards
        </Button>
      </div>
      <Modal
        title="Claim Staking Rewards"
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
          <div className={s.price}>≈$1,000</div>
        </div>
        <Button
          icon="helios"
          variant={rewards > 0 ? "success" : "primary"}
          onClick={handleClaim}
          disabled={rewards <= 0}
        >
          Claim Rewards
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
    </>
  )
}
