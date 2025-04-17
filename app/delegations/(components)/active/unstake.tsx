"use client"

import { Button } from "@/components/button"
import { Input } from "@/components/input/input"
import { Message } from "@/components/message"
import { Modal } from "@/components/modal"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import s from "./active.module.scss"

interface ModalUnstakeProps {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
}

export const ModalUnstake = ({ title, open, setOpen }: ModalUnstakeProps) => {
  const [amount, setAmount] = useState(0)

  const handleUnstake = () => {
    toast.success("Unstake successful!")
    setOpen(false)
  }

  return (
    <Modal
      title={title}
      onClose={() => setOpen(false)}
      open={open}
      className={s.modal}
      responsiveBottom
    >
      <Input
        icon="helios"
        label="Amount"
        type="number"
        step="0.000001"
        min="0"
        value={amount}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value === "" ? 0 : parseFloat(e.target.value)
          setAmount(value)
        }}
        balance={1000000}
        showMaxButton
        onMaxClick={() => setAmount(1000000)}
      />
      <Message
        icon="hugeicons:alert-02"
        variant="warning"
        title="Unbonding Period"
        className={s.message}
      >
        Your assets will be locked for 14 days during the unbonding period. You
        will not earn rewards during this time.
      </Message>
      <div className={s.group}>
        <Button
          variant="secondary"
          onClick={() => setOpen(false)}
          className={s.cancel}
        >
          Cancel
        </Button>
        <Button
          icon="hugeicons:minus-sign-circle"
          className={s.confirm}
          onClick={handleUnstake}
          variant="warning"
        >
          Confirm Unstake
        </Button>
      </div>
    </Modal>
  )
}
