"use client"

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { Modal } from "@/components/modal"
import { Symbol } from "@/components/symbol"
import { getAllTokens } from "@/config/tokens"
import { formatNumber } from "@/lib/utils/number"
import { type Token } from "@/types/Tokens"
import clsx from "clsx"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import s from "./interface.module.scss"
import { useBridge } from "@/hooks/useBridge"
import { HyperionChain } from "@/types/hyperion"
import { getLogoByHash } from "@/utils/url"
import { useAccount, useChainId, useSwitchChain } from "wagmi"

type BridgeForm = {
  asset: Token
  from: HyperionChain | null
  to: HyperionChain | null
  amount: number
  address: string
}

export const Interface = () => {
  const chainId = useChainId()
  const { chains, heliosChainIndex } = useBridge()
  const { switchChain } = useSwitchChain()

  const tokens = getAllTokens()
  const { address } = useAccount()
  const [openToken, setOpenToken] = useState(false)
  const [openChain, setOpenChain] = useState(false)
  const [chainType, setChainType] = useState<"from" | "to">("from")
  const [form, setForm] = useState<BridgeForm>({
    asset: tokens[0],
    from: null,
    to: null,
    amount: 0,
    address: address || ""
  })
  const estimatedFees = form.amount / 100
  const isDeposit = heliosChainIndex
    ? form.from?.chainId === chains[heliosChainIndex].chainId
    : false

  const handleChangeToken = (token: Token) => {
    setForm({ ...form, asset: token })
    setOpenToken(false)
  }

  const handleOpenChain = (type: "from" | "to") => {
    setChainType(type)
    setOpenChain(true)
  }

  const handleChangeChain = (chain: HyperionChain) => {
    if (chainType === "from" && chain.chainId === form.to?.chainId) {
      setForm({ ...form, from: chain, to: form.from })
    } else if (chainType === "to" && chain.chainId === form.from?.chainId) {
      setForm({ ...form, to: chain, from: form.to })
    } else {
      setForm({ ...form, [chainType]: chain })
    }
    setOpenChain(false)
  }

  const handleSwap = () => {
    setForm({ ...form, from: form.to, to: form.from })
  }

  const handleFocusInput = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.querySelector("input")?.focus()
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(form.address)
    toast.success("Address copied to clipboard")
  }

  useEffect(() => {
    if (chains.length < 2) return

    const currentChainIndex = chains.findIndex(
      (chain) => chain.chainId === chainId
    )
    const heliosIndex = heliosChainIndex ?? 0

    const from = chains[currentChainIndex]
    let to = chains[heliosIndex]

    if (heliosIndex === currentChainIndex) {
      to = chains.find((_, i) => i !== currentChainIndex) || chains[0]
    }

    setForm((prevForm) => ({
      ...prevForm,
      from,
      to
    }))
  }, [chains, heliosChainIndex, chainId])

  useEffect(() => {
    console.log(form.from)
    if (form.from && form.from?.chainId !== chainId) {
      switchChain({ chainId: form.from.chainId })
    }
  }, [form.from])

  return (
    <>
      <Card className={s.interface}>
        <Heading
          icon="hugeicons:exchange-02"
          title="Cross-Chain Bridge"
          description="Exchange your assets between chains."
        />
        <div className={s.content}>
          <div className={s.form}>
            <div
              className={clsx(s.input, s.inputToken)}
              onClick={() => setOpenToken(true)}
            >
              <Symbol
                icon={form.asset.symbolIcon}
                color={form.asset.color}
                className={s.icon}
              />
              <input className={s.value} value={form.asset.name} readOnly />
              <label htmlFor="amount" className={s.label}>
                Choose the cross-chain bridge asset
              </label>
              <Icon icon="hugeicons:arrow-right-01" className={s.arrow} />
            </div>
            {form.from && form.to && (
              <div className={s.swap}>
                <div
                  className={clsx(s.swapInput, s.from)}
                  onClick={() => handleOpenChain("from")}
                >
                  <label htmlFor="from" className={s.swapLabel}>
                    From
                  </label>
                  <div className={s.symbol}>
                    {form.from.logo !== "" && (
                      <Image
                        src={getLogoByHash(form.from.logo)}
                        alt=""
                        width={28}
                        height={28}
                      />
                    )}
                  </div>
                  <input
                    className={s.swapValue}
                    value={form.from.name}
                    readOnly
                  />
                  <Icon
                    icon="hugeicons:arrow-down-01"
                    className={s.swapArrow}
                  />
                </div>
                <button onClick={handleSwap} className={s.swapButton}>
                  <Icon icon="hugeicons:arrow-right-02" />
                </button>
                <div
                  className={clsx(s.swapInput, s.to)}
                  onClick={() => handleOpenChain("to")}
                >
                  <label htmlFor="to" className={s.swapLabel}>
                    To
                  </label>
                  <div className={s.symbol}>
                    {form.to.logo !== "" && (
                      <Image
                        src={getLogoByHash(form.to.logo)}
                        alt=""
                        width={28}
                        height={28}
                      />
                    )}
                  </div>
                  <input
                    className={s.swapValue}
                    value={form.to.name}
                    readOnly
                  />
                  <Icon
                    icon="hugeicons:arrow-down-01"
                    className={s.swapArrow}
                  />
                </div>
              </div>
            )}
            <div
              className={clsx(s.input, s.inputAmount)}
              onClick={handleFocusInput}
            >
              <input
                id="amount"
                className={s.value}
                type="number"
                step="0.000001"
                min="0"
                value={form.amount}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : parseFloat(e.target.value)
                  setForm({ ...form, amount: value })
                }}
              />
              <label htmlFor="amount" className={s.label}>
                Amount
                <small>Balance: {formatNumber(1000000)}</small>
              </label>
              <Button
                variant="secondary"
                className={s.max}
                size="xsmall"
                onClick={() => {
                  setForm({ ...form, amount: 1000000 })
                }}
              >
                Max
              </Button>
            </div>
            <div
              className={clsx(s.input, s.inputAddress)}
              onClick={handleFocusInput}
            >
              <input
                id="address"
                className={s.value}
                type="text"
                placeholder="Enter your address"
                value={form.address}
                onChange={(e) => {
                  const value = e.target.value
                  setForm({ ...form, address: value })
                }}
              />
              <label htmlFor="address" className={s.label}>
                Deposit Address
              </label>
              <Button
                variant="secondary"
                className={s.btn}
                size="xsmall"
                icon="hugeicons:copy-01"
                onClick={handleCopyAddress}
              />
            </div>
          </div>
          <div className={s.recap}>
            <div className={s.recapItem}>
              <span>Estimated Fees:</span>
              <strong>{estimatedFees} ETH</strong>
            </div>
            <div className={s.recapItem}>
              <span>You will receive:</span>
              <strong>{form.amount} ETH</strong>
            </div>
          </div>
          <Button
            className={s.deposit}
            icon={isDeposit ? "hugeicons:download-03" : "hugeicons:upload-03"}
            size="large"
          >
            {isDeposit ? "Deposit now" : "Withdraw now"}
          </Button>
        </div>
      </Card>
      <Modal
        title="Select a Token"
        onClose={() => setOpenToken(false)}
        open={openToken}
        className={s.modal}
        responsiveBottom
      >
        <ul className={s.list}>
          {tokens.map((token) => (
            <li key={token.id}>
              <Button
                variant="secondary"
                iconRight="hugeicons:arrow-right-01"
                border
                onClick={() => handleChangeToken(token)}
                hovering={token.id === form.asset.id}
                className={clsx(s.button)}
              >
                <Symbol
                  icon={token.symbolIcon}
                  color={token.color}
                  className={s.icon}
                />
                <span>{token.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      </Modal>
      <Modal
        title="Select a Chain"
        onClose={() => setOpenChain(false)}
        open={openChain}
        className={s.modal}
        responsiveBottom
      >
        <ul className={s.list}>
          {chains.map((chain) => {
            return (
              <li key={chain.chainId}>
                <Button
                  variant="secondary"
                  iconRight="hugeicons:arrow-right-01"
                  border
                  onClick={() => handleChangeChain(chain)}
                  hovering={chain.chainId === form[chainType]?.chainId}
                  className={s.button}
                >
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
            )
          })}
        </ul>
      </Modal>
    </>
  )
}
