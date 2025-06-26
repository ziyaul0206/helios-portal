"use client"

import { Button } from "@/components/button"
import { Modal } from "@/components/modal"
import clsx from "clsx"
import { useState } from "react"
import { toast } from "sonner"
import s from "./chains.module.scss"
import { useChainId, useSwitchChain } from "wagmi"
import { HyperionChain } from "@/types/hyperion"
import { getLogoByHash } from "@/utils/url"
import Image from "next/image"
import { useChains } from "@/hooks/useChains"

export const Chains = () => {
  const { chains } = useChains()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [open, setOpen] = useState(false)
  const info = chains.find((chain) => chain.chainId === chainId)

  const handleChange = (chain: HyperionChain) => {
    switchChain({ chainId: chain.chainId })
    setOpen(false)
    toast.success(`Switched to ${chain.name}`)
  }

  return (
    <>
      <Button
        variant="secondary"
        iconRight="hugeicons:arrow-down-01"
        className={clsx(s.button, s.change)}
        border
        onClick={() => setOpen(!open)}
      >
        {info && (
          <>
            <div className={s.symbol}>
              {info.logo !== "" && (
                <Image
                  src={getLogoByHash(info.logo)}
                  alt=""
                  width={28}
                  height={28}
                />
              )}
            </div>
            <span>{info.name}</span>
          </>
        )}
      </Button>
      <Modal
        title="Select a Network"
        onClose={() => setOpen(false)}
        open={open}
        className={s.modal}
        responsiveBottom
      >
        <ul className={s.list}>
          {chains.map((chain) => (
            <li key={chain.chainId}>
              <Button
                variant="secondary"
                iconRight="hugeicons:arrow-right-01"
                border
                onClick={() => handleChange(chain)}
                hovering={chain.chainId === chainId}
                className={clsx(s.button)}
              >
                {/* <Symbol
                  icon={chain.iconName}
                  color={chain.color}
                  className={s.icon}
                /> */}
                <div className={s.symbol}>
                  {chain.logo !== "" && (
                    <Image
                      src={getLogoByHash(chain.logo)}
                      alt=""
                      width={28}
                      height={28}
                    />
                  )}
                </div>
                <span>{chain.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
