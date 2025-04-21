import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getValidatorWithHisDelegationAndCommission } from "@/helpers/rpc-calls"
import { fetchCGTokenData } from "@/utils/price"
import { TOKEN_COLORS } from "@/config/constants"
import { fromWeiToEther } from "@/utils/number"

export const useValidatorDetail = (address: string) => {
  const qValidatorDetail = useQuery({
    queryKey: ["validatorDetail", address],
    queryFn: () => getValidatorWithHisDelegationAndCommission(address),
    enabled: !!address
  })

  const assets = qValidatorDetail.data?.delegation?.assets ?? []

  const qTokenData = useQuery({
    queryKey: ["tokenData", assets.map((a) => a.denom.toLowerCase())],
    queryFn: () => fetchCGTokenData(assets.map((a) => a.denom.toLowerCase())),
    enabled: assets.length > 0
  })

  const enrichedAssets = useMemo(() => {
    if (!assets.length || !qTokenData.data) return assets

    return assets.map((asset) => {
      const tokenData = qTokenData.data[asset.denom.toLowerCase()]
      const symbol = asset.denom.toLowerCase() as keyof typeof TOKEN_COLORS
      const amount = fromWeiToEther(asset.amount)
      const price = tokenData?.price || 1 // TEMP
      return {
        ...asset,
        amount,
        price: price * parseFloat(amount),
        logo: tokenData?.logo,
        color: TOKEN_COLORS[symbol] || "#ddd"
      }
    })
  }, [assets, qTokenData.data])

  return {
    validator: qValidatorDetail.data?.validator,
    delegation: {
      ...qValidatorDetail.data?.delegation,
      assets: enrichedAssets
    },
    commission: qValidatorDetail.data?.commission,
    isLoading: qValidatorDetail.isLoading || qTokenData.isLoading,
    error: qValidatorDetail.error || qTokenData.error
  }
}
