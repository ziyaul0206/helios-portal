"use client"

import { useChainId, useAccount, useChains } from "wagmi"
import { useEffect } from "react"

export const DebugNetwork = () => {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const chains = useChains()

  useEffect(() => {
    console.log("🧩 Connected:", isConnected)
    console.log("🌐 Active chainId:", chainId)
    console.log("🧱 Available chains:", chains)
    console.log("🌐 CAIP Network ID:", `eip155:${chainId}`)
  }, [chainId, chains, isConnected])

  return null
}
