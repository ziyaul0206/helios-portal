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
  const [amount, setAmount] = useState("0")
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
        amount,
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

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const normalizedValue = inputValue.replace(",", ".")

    if (!/^[0-9.,]*$/.test(normalizedValue)) return

    if (normalizedValue === "0." || normalizedValue === "0,") {
      setAmount("0.")
      return
    }

    const cleaned = normalizedValue.replace(/^0+(?=\d)/, "")

    setAmount(cleaned === "" ? "0" : cleaned)
  }

  const amountNb = parseFloat(amount)
  const isDisabled =
    isLoading ||
    !selectedAsset ||
    amountNb <= 0 ||
    (enrichedAsset && amountNb >= enrichedAsset.enriched.balance.amount)

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
          type="text"
          value={amount}
          onChange={handleAmountChange}
          balance={enrichedAsset.enriched.balance.amount}
          showMaxButton
          onMaxClick={() =>
            setAmount(
              Math.floor(enrichedAsset.enriched.balance.amount).toString()
            )
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
          disabled={isDisabled}
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
