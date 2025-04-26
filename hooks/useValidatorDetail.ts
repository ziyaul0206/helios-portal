import { useQuery } from "@tanstack/react-query"
import { getValidatorWithHisDelegationAndCommission } from "@/helpers/rpc-calls"
import { useTokenRegistry } from "@/hooks/useTokenRegistry"
import { ethers } from "ethers"
import { TokenExtended } from "@/types/token"
import { HELIOS_NETWORK_ID } from "@/config/app"

export const useValidatorDetail = (address: string) => {
  const { getTokenByAddress } = useTokenRegistry()

  const qValidatorDetail = useQuery({
    queryKey: ["validatorDetail", address],
    queryFn: () => getValidatorWithHisDelegationAndCommission(address),
    enabled: !!address
  })

  const enrichedAssetsQuery = useQuery({
    queryKey: ["enrichedValidatorAssets", address],
    enabled: !!qValidatorDetail.data?.delegation?.assets.length,
    queryFn: async (): Promise<TokenExtended[]> => {
      const assets = qValidatorDetail.data!.delegation.assets

      const results = await Promise.all(
        assets.map(async (asset) => {
          const enriched = await getTokenByAddress(
            asset.contractAddress,
            HELIOS_NETWORK_ID
          )
          if (!enriched) return null

          const amount = parseFloat(
            ethers.formatUnits(asset.amount, enriched.functionnal.decimals)
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
              amount,
              totalPrice: amount * enriched.price.usd
            }
          }
        })
      )

      return results.filter((token): token is TokenExtended => token !== null)
    }
  })

  return {
    validator: qValidatorDetail.data?.validator,
    delegation: {
      ...qValidatorDetail.data?.delegation,
      assets: enrichedAssetsQuery.data || []
    },
    commission: qValidatorDetail.data?.commission,
    isLoading: qValidatorDetail.isLoading || enrichedAssetsQuery.isLoading,
    error: qValidatorDetail.error || enrichedAssetsQuery.error
  }
}
