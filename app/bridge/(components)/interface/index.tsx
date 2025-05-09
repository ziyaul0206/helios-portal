"use client"

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { Modal } from "@/components/modal"
import { formatNumber } from "@/lib/utils/number"
import clsx from "clsx"
import Image from "next/image"
import { ChangeEvent, useEffect, useState } from "react"
import { toast } from "sonner"
import s from "./interface.module.scss"
import { useBridge } from "@/hooks/useBridge"
import { HyperionChain } from "@/types/hyperion"
import { getLogoByHash } from "@/utils/url"
import { useAccount, useChainId, useSwitchChain } from "wagmi"
// import { TokenDenom } from "@/types/denom"
import { useTokenInfo } from "@/hooks/useTokenInfo"
import { HELIOS_NETWORK_ID } from "@/config/app"
import { useQuery } from "@tanstack/react-query"
import { toHex } from "viem"
import { getTokensByChainIdAndPageAndSize } from "@/helpers/rpc-calls"
import { useTokenRegistry } from "@/hooks/useTokenRegistry"
import { Alert } from "@/app/(components)/alert"

type BridgeForm = {
  asset: string | null
  from: HyperionChain | null
  to: HyperionChain | null
  amount: number
  address: string
}

export const Interface = () => {
  const chainId = useChainId()
  const {
    chains,
    heliosChainIndex,
    // txInProgress,
    sendToChain,
    sendToHelios,
    feedback: bridgeFeedback,
    resetFeedback
  } = useBridge()
  const { switchChain } = useSwitchChain()

  const { address } = useAccount()
  // const [openToken, setOpenToken] = useState(false)
  const [openChain, setOpenChain] = useState(false)
  const [chainType, setChainType] = useState<"from" | "to">("from")
  const [form, setForm] = useState<BridgeForm>({
    asset: null,
    from: null,
    to: null,
    amount: 0,
    address: address || ""
  })

  const tokenInfo = useTokenInfo(form.asset)
  const { getTokenByAddress } = useTokenRegistry()

  const qTokensByChain = useQuery({
    queryKey: ["tokensByChain", form.to?.chainId],
    queryFn: () =>
      getTokensByChainIdAndPageAndSize(form.to!.chainId, toHex(1), toHex(10)),
    enabled: !!form.to
  })

  const qEnrichedTokensByChain = useQuery({
    queryKey: ["enrichedTokensByChain", form.from?.chainId],
    queryFn: async () => {
      const results = await Promise.all(
        qTokensByChain.data!.map((token) =>
          getTokenByAddress(token.metadata.contract_address, form.from!.chainId)
        )
      )

      return results.filter((v) => v !== null)
    },
    enabled: !!form.from && !!qTokensByChain.data?.length
  })

  const tokensByChain = qEnrichedTokensByChain.data || []

  const estimatedFees = form.amount / 100
  const isDeposit = heliosChainIndex
    ? form.to?.chainId === chains[heliosChainIndex].chainId
    : false

  // const handleChangeToken = (token: TokenDenom) => {
  //   setForm({ ...form, asset: token })
  //   setOpenToken(false)
  // }

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

  const handleMaxAmount = () => {
    setForm({ ...form, amount: tokenInfo.data?.readableBalance || 0 })
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(form.address)
    toast.success("Address copied to clipboard")
  }

  const handleTokenSearchChange = (e: { target: { value: string } }) => {
    const value = e.target.value
    setForm({ ...form, asset: value, amount: 0 })
  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value === "" ? 0 : parseFloat(e.target.value)
    if (tokenInfo.data && value > tokenInfo.data.readableBalance) {
      value = tokenInfo.data.readableBalance
    }
    setForm({ ...form, amount: value })
  }

  const handleSubmit = async () => {
    if (!form.from || !form.to || !form.asset) {
      toast.error("Missing chain or token information.")
      return
    }

    if (!tokenInfo.data) {
      toast.error("Token not found or not loaded.")
      return
    }

    if (form.amount <= 0) {
      toast.error("Amount must be greater than zero.")
      return
    }

    if (!form.address || !/^0x[a-fA-F0-9]{40}$/.test(form.address)) {
      toast.error("Invalid recipient address.")
      return
    }

    const toastId = toast.loading("Sending cross-chain transaction...")
    try {
      const decimals = tokenInfo.data.decimals

      if (form.to.chainId === HELIOS_NETWORK_ID) {
        await sendToHelios(
          form.from.chainId,
          form.address,
          form.asset,
          form.amount,
          estimatedFees,
          decimals
        )
      } else {
        await sendToChain(
          form.to.chainId,
          form.address,
          form.asset,
          form.amount,
          estimatedFees,
          decimals
        )
      }

      toast.success("Bridge transaction sent successfully!", {
        id: toastId
      })
    } catch (err: any) {
      toast.error(err?.message || "Failed to send bridge transaction.", {
        id: toastId
      })
    }
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
      from: prevForm.from ?? from,
      to: prevForm.to ?? to,
      asset: null,
      amount: 0
    }))

    resetFeedback()
  }, [chains, heliosChainIndex, chainId])

  useEffect(() => {
    if (form.from && form.from?.chainId !== chainId) {
      switchChain({ chainId: form.from.chainId })
    }
  }, [form.from])

  const isDisabled =
    !tokenInfo.data ||
    form.amount === 0 ||
    !form.address ||
    form.from?.chainId === form.to?.chainId

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
            {/* <div
              className={clsx(s.input, s.inputToken)}
              onClick={() => setOpenToken(true)}
            >
              <div className={s.symbol}>
                {form.asset && form.asset.metadata.logo !== "" && (
                  <Image
                    src={getLogoByHash(form.asset.metadata.logo)}
                    alt=""
                    width={28}
                    height={28}
                  />
                )}
              </div>
              <p className={s.value}>{form.asset?.metadata.name}</p>
              <label htmlFor="amount" className={s.label}>
                Choose the cross-chain bridge asset
              </label>
              <Icon icon="hugeicons:arrow-right-01" className={s.arrow} />
            </div> */}
            <div className={clsx(s.input, s.inputToken)}>
              <input
                id="token"
                className={s.value}
                type="text"
                value={form.asset || ""}
                placeholder="Enter the token address"
                onChange={handleTokenSearchChange}
              />
              {tokenInfo.data && (
                <div className={s.inputTokenFound}>
                  <Icon icon="hugeicons:checkmark-circle-02" />
                  {tokenInfo.data.symbol} ({tokenInfo.data.name})
                </div>
              )}

              {tokenInfo.isNotFound && (
                <div className={s.inputTokenNotFound}>
                  <Icon icon="hugeicons:help-circle" />
                  Token not found
                </div>
              )}
              <label htmlFor="token" className={s.label}>
                Token address
              </label>
            </div>
            {tokensByChain.length > 0 && (
              <div className={s.bestTokens}>
                <div className={s.bestTokensLabel}>Available tokens :</div>
                <div className={s.bestTokensList}>
                  {tokensByChain.map((token) => (
                    <Button
                      iconLeft={token.display.symbolIcon}
                      key={token.functionnal.address}
                      size="xsmall"
                      onClick={() =>
                        handleTokenSearchChange({
                          target: {
                            value: token.functionnal.address
                          }
                        })
                      }
                    >
                      {token.display.symbol.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            )}
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
                onChange={handleAmountChange}
              />
              <label htmlFor="amount" className={s.label}>
                Amount
                {tokenInfo.data && (
                  <small>
                    Balance: {formatNumber(tokenInfo.data?.readableBalance)}{" "}
                    {tokenInfo.data.symbol}
                  </small>
                )}
              </label>
              <Button
                variant="secondary"
                className={s.max}
                size="xsmall"
                onClick={handleMaxAmount}
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
              <strong>
                {isDeposit ? (
                  "No Fees"
                ) : (
                  <>
                    <small>~1% =</small>
                    {estimatedFees} {tokenInfo.data?.symbol}
                  </>
                )}
              </strong>
            </div>
            <div className={s.recapItem}>
              <span>You will receive:</span>
              <strong>
                {form.amount} {tokenInfo.data?.symbol}
              </strong>
            </div>
          </div>
          <Button
            disabled={isDisabled}
            className={s.deposit}
            icon={isDeposit ? "hugeicons:download-03" : "hugeicons:upload-03"}
            size="large"
            onClick={handleSubmit}
          >
            {isDeposit ? "Deposit now" : "Withdraw now"}
          </Button>

          {bridgeFeedback && bridgeFeedback.message !== "" && (
            <Alert type={bridgeFeedback.status}>{bridgeFeedback.message}</Alert>
          )}
          {/* {txInProgress && txInProgress.receivedToken.contract && (
            <Alert type="success">
              {`Token contract in new chain is  ${txInProgress.receivedToken.contract}`}
            </Alert>
          )} */}
        </div>
      </Card>
      {/* <Modal
        title="Select a Token"
        onClose={() => setOpenToken(false)}
        open={openToken}
        className={s.modal}
        responsiveBottom
      >
        <ul className={s.list}>
          {tokens.map((token) => (
            <li key={token.metadata.base}>
              <Button
                variant="secondary"
                iconRight="hugeicons:arrow-right-01"
                border
                onClick={() => handleChangeToken(token)}
                hovering={token.metadata.symbol === form.asset?.metadata.symbol}
                className={clsx(s.button)}
              >
                <div className={s.symbol}>
                  {token.metadata.logo !== "" && (
                    <Image
                      src={getLogoByHash(token.metadata.logo)}
                      alt=""
                      width={28}
                      height={28}
                    />
                  )}
                </div>
                <span>{token.metadata.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      </Modal> */}
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
