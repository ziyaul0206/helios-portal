import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { getAccountLastTransactions } from "@/helpers/rpc-calls"
import { useTokenRegistry } from "@/hooks/useTokenRegistry"
import { HELIOS_NETWORK_ID } from "@/config/app"
import { formatUnits } from "ethers"

export const useAccountLastTransactions = () => {
  const { address } = useAccount()
  const { getTokenBySymbol } = useTokenRegistry()

  const qLastTxs = useQuery({
    queryKey: ["accountLastTxs", address],
    queryFn: () => getAccountLastTransactions(address!),
    enabled: !!address
  })

  const enrichedTxsQuery = useQuery({
    queryKey: ["accountLastTxsEnriched", address],
    enabled: !!qLastTxs.data,
    queryFn: async () => {
      const results = await Promise.all(
        qLastTxs.data!.map(async (tx) => {
          const raw = tx.RawTransaction
          const parsed = tx.ParsedInfo

          let token = null
          let amount = null
          let usdValue = null

          if (parsed.denom && parsed.amount) {
            token = getTokenBySymbol(parsed.denom, HELIOS_NETWORK_ID) // WIP Replace with address when available
            if (token) {
              amount = parseFloat(
                formatUnits(parsed.amount, token.functionnal.decimals)
              )
              usdValue = amount * token.price.usd
            }
          }

          return {
            hash: raw.hash,
            type: parsed.type,
            from: raw.from,
            to: raw.to,
            blockNumber: parseInt(raw.blockNumber, 16),
            amount,
            usdValue,
            token: token
              ? {
                  symbol: token.display.symbol,
                  logo: token.display.symbolIcon,
                  color: token.display.color
                }
              : null
          }
        })
      )

      return results
    }
  })

  return {
    transactions: enrichedTxsQuery.data || [],
    isLoading: qLastTxs.isLoading || enrichedTxsQuery.isLoading,
    error: qLastTxs.error || enrichedTxsQuery.error
  }
}
