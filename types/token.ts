export interface TokenBalance {
  address: string
  balance: string
  balanceUI: string
  decimals: number
  denom: string
  description: string
  symbol: string
}

export interface Token {
  address: string
  enabled: boolean
  owner: number
  symbol: string
}

export interface CGToken {
  name: string
  amount: string
  symbol: string
  symbolIcon: string
  priceUSD: number
  valueUSD: number
  percentage: number
  color: string
}

export interface TokenExtended {
  display: {
    name: string
    description: string
    logo: string
    symbol: string
    symbolIcon: string
    color: string
  }
  price: {
    usd: number
  }
  balance: {
    amount: number
    totalPrice: number
  }
  functionnal: {
    address: string
    chainId: number
    denom: string
    decimals: number
  }
}
