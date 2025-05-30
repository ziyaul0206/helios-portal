import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"
import { useChainId, useAccount } from "wagmi"
import Web3 from "web3"
import { ethers } from "ethers"
import { erc20Abi } from "@/constant/helios-contracts"
import { EXPLORER_URL } from "@/config/app"

export interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  balance: string
  readableBalance: number
}

const infuraId = env.NEXT_PUBLIC_INFURA_KEY

export const rpcByChain: Record<number, string> = {
  1: "https://mainnet.infura.io/v3/" + infuraId,
  11155111: "https://sepolia.infura.io/v3/" + infuraId,
  80002: "https://rpc-amoy.polygon.technology",
  42000: "https://testnet1.helioschainlabs.org"
}

export const explorerByChain: Record<number, string> = {
  1: "https://etherscan.io",
  11155111: "https://sepolia.etherscan.io",
  80002: "https://web3.okx.com/fr/explorer/amoy",
  42000: EXPLORER_URL
}

export const fetchTokenInfo = async (
  tokenAddress: string,
  chainId: number,
  userAddress?: string
): Promise<TokenInfo> => {
  const rpcUrl = rpcByChain[chainId]
  if (!rpcUrl) throw new Error(`Missing RPC URL for chain ${chainId}`)

  try {
    const web3 = new Web3(rpcUrl)

    const code = await web3.eth.getCode(tokenAddress)
    if (code === "0x") {
      throw new Error("Address is not a contract")
    }

    const contract = new web3.eth.Contract(erc20Abi, tokenAddress)

    const [name, symbol, decimals, totalSupply, balanceRaw] = await Promise.all(
      [
        contract.methods.name().call() as Promise<string>,
        contract.methods.symbol().call() as Promise<string>,
        contract.methods.decimals().call() as Promise<string>,
        contract.methods.totalSupply().call() as Promise<string>,
        userAddress
          ? (contract.methods.balanceOf(userAddress).call() as Promise<string>)
          : Promise.resolve("0")
      ]
    )

    const decimalsInt = parseInt(decimals)
    const readableBalance = parseFloat(
      ethers.formatUnits(balanceRaw.toString(), decimalsInt)
    )

    return {
      name,
      symbol,
      decimals: decimalsInt,
      totalSupply: totalSupply.toString(),
      balance: balanceRaw.toString(),
      readableBalance
    }
  } catch (e) {
    console.error("Error fetching token info:", e)
    throw new Error("Token not found")
  }
}

export const useTokenInfo = (tokenAddress: string | null) => {
  const chainId = useChainId()
  const { address } = useAccount()

  const query = useQuery({
    queryKey: ["tokenInfo", tokenAddress, chainId, address],
    queryFn: () => {
      if (!tokenAddress) throw new Error("No token address provided")
      return fetchTokenInfo(tokenAddress, chainId, address)
    },
    enabled: !!tokenAddress && !!chainId && !!address,
    retry: false
  })

  const isNotFound = query.error?.message === "Token not found"

  return {
    ...query,
    isNotFound
  }
}
