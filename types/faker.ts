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
  name: string
  commission: number
  apy: number
  base: number
  assets: TokenWithAmount[]
  rewards: number
}
