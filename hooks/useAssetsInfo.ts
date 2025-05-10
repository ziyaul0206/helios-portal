import { getAllWhitelistedAssets } from "@/helpers/rpc-calls"
import { fromWeiToEther, secondsToMilliseconds } from "@/utils/number"
import { useQuery } from "@tanstack/react-query"
import { useTokenRegistry } from "./useTokenRegistry"
import { HELIOS_NETWORK_ID } from "@/config/app"

export const useAssetsInfo = () => {
  const { getTokenByAddress } = useTokenRegistry()

  const qAssets = useQuery({
    queryKey: ["whitelistedAssets"],
    queryFn: getAllWhitelistedAssets,
    refetchInterval: secondsToMilliseconds(60)
  })

  const qFilteredAssets = useQuery({
    queryKey: ["filteredAssets", qAssets.data],
    enabled: !!qAssets.data,
    queryFn: async () => {
      const data = qAssets.data || []
      const filteredAssets = data.filter((asset) => asset.totalShares !== "0")

      const enrichedAssets = await Promise.all(
        filteredAssets.map(async (asset) => {
          const enriched = await getTokenByAddress(
            asset.contractAddress,
            HELIOS_NETWORK_ID
          )
          if (!enriched) return null

          const tokenAmount = parseFloat(asset.totalShares) / asset.baseWeight
          const tokenAmountFormatted = fromWeiToEther(tokenAmount.toString())
          const tvlUSD = parseFloat(tokenAmountFormatted) * enriched.price.usd

          return {
            ...asset,
            tokenAmount: tokenAmountFormatted,
            tvlUSD,
            enriched
          }
        })
      )

      return enrichedAssets.filter((v) => v !== null)
    }
  })

  const totalTVL =
    qFilteredAssets.data?.reduce((sum, asset) => sum + asset.tvlUSD, 0) || 0

  return {
    forceRefresh: qAssets.refetch,
    assets: qFilteredAssets.data || [],
    totalTVL,
    holders: 0, // @TODO
    isLoading: qAssets.isLoading || qFilteredAssets.isLoading,
    error: qAssets.error || qFilteredAssets.error
  }
}
