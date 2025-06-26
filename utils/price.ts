import { CDN_URL, HELIOS_TOKEN_ADDRESS } from "@/config/app"

interface CGToken {
  symbol: string
  current_price: number
  image: string
}

interface TokenData {
  price: number
  logo: string
}

const tempHLS: Record<string, TokenData> = {
  hls: {
    price: 0.05,
    logo: `${CDN_URL}/token/${HELIOS_TOKEN_ADDRESS}`
  }
}

const cgCache = new Map<string, TokenData>()
const inFlightCGRequests = new Map<string, Promise<Record<string, TokenData>>>()

export const fetchCGTokenData = async (
  symbols: string[]
): Promise<Record<string, TokenData>> => {
  if (symbols.length === 0) return {}

  const result: Record<string, TokenData> = {}
  const toFetch: string[] = []

  for (const symbol of symbols.map((s) => s.toLowerCase())) {
    if (symbol === "hls") {
      result[symbol] = tempHLS[symbol]
    } else if (cgCache.has(symbol)) {
      result[symbol] = cgCache.get(symbol)!
    } else {
      toFetch.push(symbol)
    }
  }

  if (toFetch.length === 0) return result

  const key = toFetch.sort().join(",")

  if (inFlightCGRequests.has(key)) {
    const pending = await inFlightCGRequests.get(key)!
    return { ...result, ...pending }
  }

  const promise = (async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${toFetch.join(
          ","
        )}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      )

      if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)

      const data: CGToken[] = await res.json()

      const fetched: Record<string, TokenData> = {}

      for (const token of data) {
        const symbol = token.symbol.toLowerCase()
        const tokenData = {
          price: token.current_price,
          logo: token.image
        }
        fetched[symbol] = tokenData
        cgCache.set(symbol, tokenData)
      }

      return fetched
    } catch (err) {
      console.error("Error while fetching CG token data:", err)
      return {}
    } finally {
      inFlightCGRequests.delete(key)
    }
  })()

  inFlightCGRequests.set(key, promise)

  const fetched = await promise
  return { ...result, ...fetched }
}
