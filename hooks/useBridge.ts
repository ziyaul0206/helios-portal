import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ethers } from "ethers"
import { Feedback } from "@/types/feedback"
import { useAccount, useChainId } from "wagmi"
import { BRIDGE_CONTRACT_ADDRESS, bridgeAbi } from "@/constant/helios-contracts"
import { getErrorMessage } from "@/utils/string"
import { useWeb3Provider } from "./useWeb3Provider"
import {
  getHyperionChains,
  getTokensByChainIdAndPageAndSize
} from "@/helpers/rpc-calls"
import { toHex } from "@/utils/number"

export const useBridge = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  const web3Provider = useWeb3Provider()

  const qHyperionChains = useQuery({
    queryKey: ["hyperionChains"],
    queryFn: getHyperionChains
  })

  const qTokensByChain = useQuery({
    queryKey: ["tokens", chainId],
    queryFn: () =>
      getTokensByChainIdAndPageAndSize(chainId, toHex(1), toHex(10)),
    enabled: !!chainId
  })

  const [feedback, setFeedback] = useState<Feedback>({
    status: "idle",
    message: ""
  })

  const sendToChainMutation = useMutation({
    mutationFn: async ({
      chainId,
      receiverAddress,
      tokenAddress,
      amount,
      fees
    }: {
      chainId: number
      receiverAddress: string
      tokenAddress: string
      amount: number
      fees: number
    }) => {
      if (!web3Provider) throw new Error("No wallet connected")

      try {
        setFeedback({
          status: "loading",
          message: "Transaction in progress..."
        })

        const contract = new web3Provider.eth.Contract(
          bridgeAbi,
          BRIDGE_CONTRACT_ADDRESS
        )
        const tx = await contract.methods
          .sendToChain(
            chainId,
            receiverAddress,
            tokenAddress,
            ethers.parseEther(amount.toString()),
            ethers.parseEther(fees.toString())
          )
          .send({
            from: address,
            gas: "500000"
          })

        setFeedback({
          status: "loading",
          message: `Transaction send (hash: ${tx.transactionHash}), waiting for confirmation...`
        })

        const receipt = await web3Provider.eth.getTransactionReceipt(
          tx.transactionHash
        )
        setFeedback({
          status: "success",
          message: `Transaction confirmed in block ${receipt.blockNumber}`
        })

        return receipt
      } catch (error: any) {
        setFeedback({
          status: "error",
          message: getErrorMessage(error) || "Error during bridge"
        })
        throw error
      }
    }
  })

  const sendToChain = async (
    chainId: number,
    receiverAddress: string,
    tokenAddress: string,
    amount: number,
    fees: number
  ) => {
    await sendToChainMutation.mutateAsync({
      chainId,
      receiverAddress,
      tokenAddress,
      amount,
      fees
    })
  }

  return {
    chains: qHyperionChains.data || [],
    tokens: qTokensByChain.data || [],
    heliosChainIndex: qHyperionChains.data?.findIndex(
      (chain) => chain.hyperionId === 0
    ),
    sendToChain,
    feedback,
    isLoading: sendToChainMutation.isPending
  }
}
