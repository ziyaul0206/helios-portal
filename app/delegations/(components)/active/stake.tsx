"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/button"
import { Input } from "@/components/input/input"
import { Select } from "@/components/input/select"
import { Modal } from "@/components/modal"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import s from "./active.module.scss"
import { useAssetsInfo } from "@/hooks/useAssetsInfo"
import { useDelegate } from "@/hooks/useDelegate"
import { Message } from "@/components/message"

interface ModalStakeProps {
  title: string
  validatorAddress: string
  open: boolean
  setOpen: (open: boolean) => void
}

export const ModalStake = ({
  title,
  validatorAddress,
  open,
  setOpen
}: ModalStakeProps) => {
  const router = useRouter()
  const [amount, setAmount] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState("")
  const { assets } = useAssetsInfo()
  const { delegate, isLoading, feedback, resetFeedback } = useDelegate()

  const enrichedAsset = assets?.find(
    (asset) => asset.enriched.functionnal.address === selectedAsset
  )

  const handleStake = async () => {
    if (!enrichedAsset) {
      toast.error("Please select an asset")
      return
    }

    const toastId = toast.loading("Sending delegation transaction...")
    try {
      await delegate(
        validatorAddress,
        amount.toString(),
        enrichedAsset.enriched.functionnal.denom,
        enrichedAsset.enriched.functionnal.decimals
      )

      toast.success("Delegation successful!", {
        id: toastId
      })
      setOpen(false)
      resetFeedback()

      router.push("/delegations")
    } catch (err: any) {
      toast.error(err?.message || "Error during delegation", {
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
          assets?.map((asset) => ({
            value: asset.enriched.functionnal.address,
            label: asset.enriched.display.name
          })) || []
        }
        label="Choose an asset"
      />

      {enrichedAsset && (
        <Input
          icon={enrichedAsset.enriched.display.symbolIcon}
          label="Amount"
          type="number"
          step="0.000001"
          min="0"
          value={amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value === "" ? 0 : parseFloat(e.target.value)
            setAmount(value)
          }}
          balance={enrichedAsset.enriched.balance.amount}
          showMaxButton
          onMaxClick={() =>
            setAmount(Math.floor(enrichedAsset.enriched.balance.amount))
          }
        />
      )}
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
          disabled={!selectedAsset || amount <= 0 || isLoading}
        >
          Confirm Stake
        </Button>
      </div>
      {feedback && feedback.message !== "" && (
        <Message title="Staking feedback" variant={feedback.status}>
          {feedback.message}
        </Message>
      )}
    </Modal>
  )
}
