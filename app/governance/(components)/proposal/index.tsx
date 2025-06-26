"use client"

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Message } from "@/components/message"
import { useState } from "react"
import { ModalProposal } from "./modal"
import s from "./proposal.module.scss"

export const Proposal = () => {
  const [open, setOpen] = useState(false)

  return (
    <Card auto className={s.proposal}>
      <Heading
        icon="hugeicons:keyframes-double-add"
        title="Submit a Proposal"
      />
      <p className={s.description}>
        Create a new governance proposal to suggest changes to the Helios
        network parameters, add new assets, or modify existing ones.
      </p>
      <Button
        onClick={() => setOpen(true)}
        iconRight="hugeicons:keyframes-double-add"
      >
        Submit a Proposal
      </Button>
      <ModalProposal open={open} onClose={() => setOpen(false)} />
      <Message icon="hugeicons:information-circle" title="About Proposals">
        Submitting a proposal requires a deposit of 100 HLS. This deposit will
        be returned if the proposal reaches quorum, regardless of the outcome.
      </Message>
    </Card>
  )
}
