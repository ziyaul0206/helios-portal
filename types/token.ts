export interface TokensBalance {
  Balances: TokenBalance[]
  TotalCount: number
}

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

export interface TokenMetadataResponse {
  metadata: {
    description: string
    denomUnits: {
      denom: string
      exponent?: number
    }[]
    base: string
    display: string
    name: string
    symbol: string
    decimals: number
    logo: string
    contract_address: string
    chainsMetadatas: {
      chainId: number
      symbol: string
      decimals: number
      contractAddress: string
      isOriginated: boolean
    }[]
  }
  holdersCount: number
  total_supply: string
}
