import { useQuery, useQueries } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { getTokensBalance } from "@/helpers/rpc-calls"
import { toHex } from "@/utils/number"
import { useTokenRegistry } from "./useTokenRegistry"
import { TokenExtended } from "@/types/token"
import { ethers } from "ethers"

export const usePortfolioInfo = () => {
  const { address } = useAccount()
  const { getTokenByAddress } = useTokenRegistry()

  const qTokenBalances = useQuery({
    queryKey: ["tokensBalance", address],
    queryFn: () => getTokensBalance(address!, toHex(1), toHex(10)),
    enabled: !!address
  })

  const tokenQueries = useQueries({
    queries:
      qTokenBalances.data?.map((token) => ({
        queryKey: ["enrichedToken", token.address],
        queryFn: async (): Promise<TokenExtended> => {
          const enriched = await getTokenByAddress(token.address)
          if (!enriched) throw new Error("Token not found")

          const amount = ethers.formatUnits(
            token.balance,
            enriched.functionnal.decimals
          )

          return {
            ...enriched,
            display: {
              ...enriched.display,
              symbolIcon:
                enriched.display.symbolIcon ||
                `token:${enriched.display.symbol.toLowerCase()}`
            },
            balance: {
              amount: parseFloat(amount)
            },
            price: {
              usd: enriched.price.usd
            }
          }
        },
        enabled: !!token.address
      })) || []
  })

  const isLoading =
    qTokenBalances.isLoading || tokenQueries.some((q) => q.isLoading)
  const error = qTokenBalances.error || tokenQueries.find((q) => q.error)?.error

  const portfolio: TokenExtended[] = tokenQueries
    .map((q) => q.data)
    .filter(Boolean) as TokenExtended[]

  const totalUSD = portfolio.reduce(
    (sum, token) => sum + token.balance.amount * token.price.usd,
    0
  )

  return {
    totalUSD,
    portfolio,
    isLoading,
    error
  }
}
