import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { getDelegations, getValidator } from "@/helpers/rpc-calls"
import { useTokenRegistry } from "./useTokenRegistry"
import { TokenExtended } from "@/types/token"
import { ethers } from "ethers"
import { HELIOS_NETWORK_ID, HELIOS_TOKEN_ADDRESS } from "@/config/app"
import { secondsToMilliseconds } from "@/utils/number"

export const useDelegationInfo = () => {
  const { address } = useAccount()
  const { getTokenByAddress } = useTokenRegistry()

  const qDelegations = useQuery({
    queryKey: ["delegations", address],
    queryFn: () => getDelegations(address!),
    enabled: !!address,
    refetchInterval: secondsToMilliseconds(60)
  })

  const validatorAddresses =
    qDelegations.data?.map((d) => d.validatorAddress) ?? []
  const uniqueValidatorAddresses = Array.from(new Set(validatorAddresses))

  const qValidators = useQuery({
    queryKey: ["validators", address, uniqueValidatorAddresses],
    enabled: uniqueValidatorAddresses.length > 0,
    queryFn: () =>
      Promise.all(uniqueValidatorAddresses.map((addr) => getValidator(addr)))
  })

  const enrichedDelegationsQuery = useQuery({
    queryKey: [
      "delegationsEnriched",
      address,
      qDelegations.data,
      qValidators.data
    ],
    enabled: !!qDelegations.data?.length && !!qValidators.data,
    queryFn: async () => {
      const validatorsMap = new Map(
        qValidators.data!.map((v) => [v?.validatorAddress, v])
      )

      const results: Array<{
        validatorAddress: string
        commission: number
        moniker: string
        apr: number
        totalUSD: number
        tokens: TokenExtended[]
        rewards: number
        rewardsPrice: number
      }> = []
      for (const delegation of qDelegations.data!) {
        const validator = validatorsMap.get(delegation.validatorAddress)
        if (!validator) continue

        const enrichedTokens: (TokenExtended & { isBoost?: boolean })[] = []

        const assets = [
          ...delegation.assets,
          {
            denom: "helios",
            baseAmount: "",
            amount: delegation.totalBoost,
            weightedAmount: "",
            contractAddress: HELIOS_TOKEN_ADDRESS
          }
        ]

        // Utilisez 'assets' au lieu de 'delegation.assets' dans la suite du code
        for (const asset of assets) {
          const token = await getTokenByAddress(
            asset.contractAddress,
            HELIOS_NETWORK_ID
          )
          if (!token) continue

          const amount = parseFloat(
            ethers.formatUnits(asset.amount, token.functionnal.decimals)
          )

          enrichedTokens.push({
            ...token,
            balance: {
              amount,
              totalPrice: amount * token.price.usd
            }
          })
        }

        const rewards = parseFloat(
          ethers.formatUnits(delegation.rewards.amount, 18)
        )
        const rewardsToken = await getTokenByAddress(
          HELIOS_TOKEN_ADDRESS,
          HELIOS_NETWORK_ID
        )

        results.push({
          validatorAddress: delegation.validatorAddress,
          commission: parseFloat(validator.commission.commission_rates.rate),
          moniker: validator.moniker,
          apr: parseFloat(validator.apr),
          tokens: enrichedTokens,
          totalUSD: enrichedTokens.reduce(
            (sum, t) => sum + t.balance.totalPrice,
            0
          ),
          rewards,
          rewardsPrice: rewards * (rewardsToken?.price.usd ?? 0)
        })
      }

      return results
    }
  })

  const totalDelegatedUSD =
    enrichedDelegationsQuery.data?.reduce((sum, v) => sum + v.totalUSD, 0) ?? 0

  const averageApr =
    enrichedDelegationsQuery.data?.reduce((sum, v) => sum + v.apr, 0) ?? 0
  const finalApr =
    enrichedDelegationsQuery.data && enrichedDelegationsQuery.data.length > 0
      ? averageApr / enrichedDelegationsQuery.data.length
      : 0

  const enrichedRewardsQuery = useQuery({
    queryKey: ["rewardsEnriched", qDelegations.data],
    enabled: !!qDelegations.data,
    queryFn: async () => {
      const rewardsToken = await getTokenByAddress(
        HELIOS_TOKEN_ADDRESS,
        HELIOS_NETWORK_ID
      )
      const rewardsTokenPrice = rewardsToken?.price?.usd ?? 0

      const totalRewards =
        qDelegations.data?.reduce((sum, v) => {
          return sum + parseFloat(ethers.formatUnits(v.rewards.amount, 18))
        }, 0) ?? 0

      return {
        amount: totalRewards,
        price: totalRewards * rewardsTokenPrice
      }
    }
  })

  return {
    totalDelegatedUSD,
    averageApr: finalApr,
    validatorsCount: enrichedDelegationsQuery.data?.length || 0,
    delegationsByValidator: enrichedDelegationsQuery.data || [],
    totalRewards: enrichedRewardsQuery.data ?? null,
    isLoading:
      qDelegations.isLoading ||
      qValidators.isLoading ||
      enrichedDelegationsQuery.isLoading ||
      enrichedRewardsQuery.isLoading,
    error:
      qDelegations.error ||
      qValidators.error ||
      enrichedDelegationsQuery.error ||
      enrichedRewardsQuery.error
  }
}
