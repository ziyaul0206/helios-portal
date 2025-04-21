import { useState } from "react"
import { useChainId, useAccount } from "wagmi"
import { fetchTokenInfo } from "@/hooks/useTokenInfo"
import { TokenExtended } from "@/types/token"
import { fetchCGTokenData } from "@/utils/price"
import { TOKEN_COLORS } from "@/config/constants"
import { APP_COLOR_DEFAULT } from "@/config/app"

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
      const symbol = info.symbol.toLowerCase()
      const cgData = await fetchCGTokenData([symbol])
      const cgToken = cgData[info.symbol.toLowerCase()]
      const unitPrice = cgToken?.price || 0

      const newToken: TokenExtended = {
        display: {
          name: info.name,
          description: "",
          logo: cgToken?.logo || "",
          symbol,
          symbolIcon: symbol === "hls" ? "helios" : "token:" + symbol,
          color:
            TOKEN_COLORS[symbol as keyof typeof TOKEN_COLORS] ||
            APP_COLOR_DEFAULT
        },
        price: {
          usd: unitPrice
        },
        balance: {
          amount: info.readableBalance,
          totalPrice: info.readableBalance * unitPrice
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
      console.error("Error while fetching token address : " + tokenAddress, err)
      return null
    }
  }

  return {
    tokens,
    getTokenByAddress
  }
}
