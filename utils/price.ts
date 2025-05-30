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

// export const fetchCGTokenData = async (
//   symbols: string[]
// ): Promise<Record<string, TokenData>> => {
//   if (symbols.length === 0) return {}

//   return symbols.reduce<Record<string, TokenData>>((acc, symbol) => {
//     acc[symbol.toLowerCase()] = {
//       price: (Math.random() * 10000) / 10000,
//       logo: `https://via.placeholder.com/32?text=${symbol[0].toUpperCase()}`
//     }
//     return acc
//   }, {})
// }

export const fetchCGTokenData = async (
  symbols: string[]
): Promise<Record<string, TokenData>> => {
  if (symbols.length === 0) return {}
  const ids = symbols.join(",")

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&symbols=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    )
    const data: CGToken[] = await res.json()

    if (data.length === 0 && symbols.includes("hls")) {
      return {
        hls: {
          price: 1,
          logo: `${CDN_URL}/token/${HELIOS_TOKEN_ADDRESS}`
        }
      }
    }

    return data.reduce<Record<string, TokenData>>((acc, token) => {
      acc[token.symbol] = { price: token.current_price, logo: token.image }
      return acc
    }, {})
  } catch (error) {
    console.error("Error while fetching prices:", error)

    // If HLS is in the list, return at least its default price
    if (symbols.includes("hls")) {
      return {
        hls: {
          price: 1,
          logo: `${CDN_URL}/token/${HELIOS_TOKEN_ADDRESS}`
        }
      }
    }

    // For other cases, return an empty object
    return {}
  }
}
