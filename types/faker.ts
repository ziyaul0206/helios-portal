import { TokenExtended } from "./token"
import { TokenWithAmount } from "./Tokens"

export interface ValidatorProps {
  name: string
  description: string
  image: string
  apyBoost: number
  reputation: number
  uptime: number
  commission: number
}

export interface ValidatorRow {
  address: string
  name: string
  commission: number
  apy: number
  // base: number
  assets: TokenExtended[]
  rewards: number
  rewardsPrice: number
}

export type VoteVote = "yes" | "no" | "abstain" | "veto"

export interface VoteProps {
  status: "active" | "passed" | "rejected"
  name: string
  hip: number
  date: string
  vote: VoteVote
}
