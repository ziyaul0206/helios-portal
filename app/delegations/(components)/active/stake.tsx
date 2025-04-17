"use client"

import { Button } from "@/components/button"
import { Input } from "@/components/input/input"
import { Modal } from "@/components/modal"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import s from "./active.module.scss"

interface ModalStakeProps {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
}

export const ModalStake = ({ title, open, setOpen }: ModalStakeProps) => {
  const [amount, setAmount] = useState(0)

  const handleStake = () => {
    toast.success("Stake successful!")
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
      <div className={s.group}>
        <Button
          variant="secondary"
          onClick={() => setOpen(false)}
          className={s.cancel}
        >
          Cancel
        </Button>
        <Button
          icon="hugeicons:add-circle"
          className={s.confirm}
          onClick={handleStake}
        >
          Confirm Stake
        </Button>
      </div>
    </Modal>
  )
}
