"use client"

import { Button } from "@/components/button"
import { Modal } from "@/components/modal"
import { useState } from "react"
import s from "./list.module.scss"

export const Informations = () => {
  const [information, setInformation] = useState(false)

  return (
    <>
      <Button
        icon="hugeicons:information-circle"
        variant="secondary"
        border
        onClick={() => setInformation(true)}
      />
      <Modal
        title="Helios APY Boost System"
        onClose={() => setInformation(false)}
        open={information}
        className={s.information}
      >
        <p>
          Validators must maintain a balance of HELIOS tokens relative to other
          staked assets to maximize APY. Insufficient HELIOS collateral results
          in reduced rewards for delegators. Look for validators with{" "}
          <strong>Optimal Boost</strong> status for maximum returns.
        </p>
        <Button border onClick={() => setInformation(false)}>
          I understand
        </Button>
      </Modal>
    </>
  )
}
