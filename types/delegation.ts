export interface DelegationAsset {
  denom: string
  baseAmount: string
  amount: string
  weightedAmount: string
  contractAddress: string
}

export interface DelegationReward {
  denom: string
  amount: string
  contractAddress: string
}

export interface Delegation {
  validatorAddress: string
  shares: string
  assets: DelegationAsset[]
  rewards: DelegationReward
  totalBoost: string
}
