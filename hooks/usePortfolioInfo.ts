import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { getTokensBalance } from "@/helpers/rpc-calls"
import { fromWeiToEther, toHex } from "@/utils/number"
import { fetchCGTokenData } from "@/utils/price"
import { CGToken } from "@/types/token"
import { TOKEN_COLORS } from "@/config/constants"
import { APP_COLOR_SECONDARY } from "@/config/app"
import { useEffect } from "react"
import { useTokenRegistry } from "./useTokenRegistry"

export const usePortfolioInfo = () => {
  const { address } = useAccount()
  const { getTokenByAddress } = useTokenRegistry()

  useEffect(() => {
    getTokenByAddress("0xC8E59eB54CF3345e1736650eEC685d0E8B821481").then(
      (token) => {
        if (token) console.log("Token fetched:", token)
      }
    )
  }, [])

  const qTokenBalances = useQuery({
    queryKey: ["tokensBalance", address],
    queryFn: () => getTokensBalance(address!, toHex(1), toHex(10)),
    enabled: !!address
  })

  const qTokenData = useQuery({
    queryKey: [
      "tokenData",
      qTokenBalances.data?.map((t) => t.symbol.toLowerCase())
    ],
    queryFn: () =>
      fetchCGTokenData(
        qTokenBalances.data?.map((t) => t.symbol.toLowerCase()) || []
      ),
    enabled: !!qTokenBalances.data
  })

  let totalUSD = 0
  let portfolio: CGToken[] = []

  if (qTokenBalances.data && qTokenData.data) {
    portfolio = qTokenBalances.data.map((token) => {
      const symbol = token.symbol.toLowerCase() as keyof typeof TOKEN_COLORS
      const amount = fromWeiToEther(token.balance)
      const priceUSD = qTokenData.data[symbol]?.price || 1 // TEMP
      const valueUSD = parseFloat(amount) * priceUSD

      if (symbol === "hls") {
        return {
          name: "Helios",
          symbol: "HLS",
          symbolIcon: "helios",
          amount,
          valueUSD,
          priceUSD,
          percentage: 0,
          color: TOKEN_COLORS[symbol] || APP_COLOR_SECONDARY
        }
      }

      return {
        name: token.denom,
        symbol: symbol.toUpperCase(),
        symbolIcon: "token:" + token.symbol.toLowerCase(),
        amount,
        valueUSD,
        priceUSD,
        percentage: 0,
        color: TOKEN_COLORS[symbol] || "#ddd"
      }
    })

    totalUSD = portfolio.reduce((sum, asset) => sum + asset.valueUSD, 0)

    portfolio = portfolio.map((asset) => ({
      ...asset,
      percentage: totalUSD ? (asset.valueUSD / totalUSD) * 100 : 0
    }))
  }

  return {
    totalUSD,
    portfolio,
    isLoading: qTokenBalances.isLoading || qTokenData.isLoading,
    error: qTokenBalances.error || qTokenData.error
  }
}
