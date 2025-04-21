import { useState } from "react"
import { useChainId, useAccount } from "wagmi"
import { fetchTokenInfo } from "@/hooks/useTokenInfo"
import { TokenExtended } from "@/types/token"
import { fetchCGTokenData } from "@/utils/price"

export const useTokenRegistry = () => {
  const [tokens, setTokens] = useState<TokenExtended[]>([])
  const chainId = useChainId()
  const { address: userAddress } = useAccount()

  console.log("tokens", tokens)

  const getTokenByAddress = async (
    tokenAddress: string
  ): Promise<TokenExtended | null> => {
    const existing = tokens.find(
      (t) =>
        t.functionnal.address.toLowerCase() === tokenAddress.toLowerCase() &&
        t.functionnal.chainId === chainId
    )
    if (existing) return existing

    try {
      const info = await fetchTokenInfo(tokenAddress, chainId, userAddress)
      const cgData = await fetchCGTokenData([info.symbol])
      const cgToken = cgData[info.symbol.toLowerCase()]

      const newToken: TokenExtended = {
        display: {
          name: info.name,
          description: "",
          logo: cgToken?.logo || "",
          symbol: info.symbol,
          symbolIcon: "token:" + info.symbol.toLowerCase() || ""
        },
        price: {
          usd: cgToken?.price || 0
        },
        balance: {
          amount: info.readableBalance
        },
        functionnal: {
          address: tokenAddress,
          chainId: chainId,
          denom: info.symbol,
          decimals: info.decimals
        }
      }

      setTokens((prev) => [...prev, newToken])
      return newToken
    } catch (err) {
      console.error("Error while fetching token:", err)
      return null
    }
  }

  return {
    tokens,
    getTokenByAddress
  }
}
