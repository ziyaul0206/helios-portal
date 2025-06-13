import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { getAccountLastTransactions } from "@/helpers/rpc-calls"
import { useTokenRegistry } from "@/hooks/useTokenRegistry"
import { HELIOS_NETWORK_ID, HELIOS_TOKEN_ADDRESS } from "@/config/app"
import { ethers, formatUnits } from "ethers"
import { secondsToMilliseconds } from "@/utils/number"

export const useAccountLastTransactions = () => {
  const { address } = useAccount()
  const { getTokenByAddress } = useTokenRegistry()

  const qLastTxs = useQuery({
    queryKey: ["accountLastTxs", address],
    queryFn: () => getAccountLastTransactions(address!),
    refetchInterval: secondsToMilliseconds(60),
    enabled: !!address
  })

  const enrichedTxsQuery = useQuery({
    queryKey: ["accountLastTxsEnriched", address, qLastTxs.data],
    enabled: !!qLastTxs.data,
    queryFn: async () => {
      const results = await Promise.all(
        qLastTxs.data!.map(async (tx) => {
          const raw = tx.RawTransaction
          const parsed = tx.ParsedInfo

          let token = null
          let amount = parseFloat(ethers.formatEther(raw.value))
          let usdValue = null

          if (parsed.contractAddress && parsed.amount) {
            token = await getTokenByAddress(
              parsed.contractAddress,
              HELIOS_NETWORK_ID
            )
            if (token) {
              amount = parseFloat(
                formatUnits(parsed.amount, token.functionnal.decimals)
              )
              usdValue = amount * token.price.usd
            }
          } else {
            token = await getTokenByAddress(
              HELIOS_TOKEN_ADDRESS,
              HELIOS_NETWORK_ID
            )
          }

          return {
            hash: raw.hash,
            type: parsed.type,
            from: raw.from,
            to: raw.to,
            blockNumber: parseInt(raw.blockNumber, 16),
            amount,
            usdValue,
            token: token ?? null
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
