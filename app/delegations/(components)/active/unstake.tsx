"use client"

import { Button } from "@/components/button"
import { Input } from "@/components/input/input"
import { Select } from "@/components/input/select"
import { Message } from "@/components/message"
import { Modal } from "@/components/modal"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import s from "./active.module.scss"
import { useDelegate } from "@/hooks/useDelegate"
import { TokenExtended } from "@/types/token"

interface ModalUnstakeProps {
  title: string
  validatorAddress: string
  delegatedAssets: TokenExtended[]
  open: boolean
  setOpen: (open: boolean) => void
}

export const ModalUnstake = ({
  title,
  validatorAddress,
  delegatedAssets,
  open,
  setOpen
}: ModalUnstakeProps) => {
  const [amount, setAmount] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState("")
  const { undelegate, isLoading, feedback } = useDelegate()

  const enrichedAsset = delegatedAssets?.find(
    (asset) => asset.functionnal.address === selectedAsset
  )

  const handleUnstake = async () => {
    if (!enrichedAsset) {
      toast.error("Please select an asset")
      return
    }

    const toastId = toast.loading("Sending unstake transaction...")
    try {
      await undelegate(
        validatorAddress,
        amount.toString(),
        enrichedAsset.functionnal.denom,
        enrichedAsset.functionnal.decimals
      )

      toast.success("Unstake successful!", {
        id: toastId
      })
      setOpen(false)
    } catch (err: any) {
      toast.error(err?.message || "Error during unstake", {
        id: toastId
      })
    }
  }

  return (
    <Modal
      title={title}
      onClose={() => setOpen(false)}
      open={open}
      className={s.modal}
      responsiveBottom
    >
      <Select
        value={selectedAsset}
        onChange={(evt) => setSelectedAsset(evt.target.value)}
        placeholder="Please select an asset"
        options={
          delegatedAssets?.map((asset) => ({
            value: asset.functionnal.address,
            label: asset.display.name
          })) || []
        }
        label="Choose an asset"
      />

      {enrichedAsset && (
        <Input
          icon={enrichedAsset.display.symbolIcon}
          label="Amount"
          type="number"
          step="0.000001"
          min="0"
          value={amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value === "" ? 0 : parseFloat(e.target.value)
            setAmount(value)
          }}
          balance={enrichedAsset.balance.amount}
          showMaxButton
          onMaxClick={() => setAmount(Math.floor(enrichedAsset.balance.amount))}
        />
      )}

      <Message
        icon="hugeicons:alert-02"
        variant="warning"
        title="Unbonding Period"
        className={s.message}
      >
        Your assets will be locked for 14 days during the unbonding period. You
        will not earn any rewards during this period.
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
          disabled={!selectedAsset || amount <= 0 || isLoading}
        >
          Confirm Unstake
        </Button>
      </div>
      {feedback && feedback.message !== "" && (
        <Message title="Unstaking feedback" variant={feedback.status}>
          {feedback.message}
        </Message>
      )}
    </Modal>
  )
}
