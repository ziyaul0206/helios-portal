import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useAccount, useChainId } from "wagmi"
import { getErrorMessage } from "@/utils/string"
import { useWeb3Provider } from "./useWeb3Provider"
import { ethers } from "ethers"
import {
  BRIDGE_HYPERION_ADDRESS,
  BRIDGE_CONTRACT_ADDRESS,
  bridgeSendToChainAbi,
  bridgeSendToHeliosAbi,
  erc20Abi
} from "@/constant/helios-contracts"
import {
  getHyperionChains,
  getTokensByChainIdAndPageAndSize
} from "@/helpers/rpc-calls"
import { toHex } from "viem"

export const useBridge = () => {
  const { address } = useAccount()
  const web3Provider = useWeb3Provider()
  const chainId = useChainId()

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

  const [feedback, setFeedback] = useState({
    status: "idle",
    message: ""
  })

  // 🟡 sendToChain
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
      amount: bigint
      fees: bigint
    }) => {
      if (!web3Provider || !address) throw new Error("No wallet connected")

      try {
        setFeedback({
          status: "loading",
          message: "Sending cross-chain transaction..."
        })

        const contract = new web3Provider.eth.Contract(
          bridgeSendToChainAbi,
          BRIDGE_CONTRACT_ADDRESS
        )

        const tx = await contract.methods
          .sendToChain(
            chainId,
            receiverAddress,
            tokenAddress,
            amount.toString(),
            fees.toString()
          )
          .send({
            from: address,
            gas: "500000"
          })

        setFeedback({
          status: "loading",
          message: `Transaction sent (hash: ${tx.transactionHash}), waiting for confirmation...`
        })

        const receipt = await web3Provider.eth.getTransactionReceipt(
          tx.transactionHash
        )

        setFeedback({
          status: "success",
          message: `Transaction confirmed in block ${receipt.blockNumber}`
        })

        return receipt
      } catch (error: unknown) {
        setFeedback({
          status: "error",
          message: getErrorMessage(error) || "Error during sendToChain"
        })
        throw error
      }
    }
  })

  // 🟢 sendToHelios
  const sendToHeliosMutation = useMutation({
    mutationFn: async ({
      tokenAddress,
      heliosEthAddress,
      amount
    }: {
      tokenAddress: string
      heliosEthAddress: string
      amount: bigint
    }) => {
      if (!web3Provider || !address) throw new Error("No wallet connected")

      try {
        setFeedback({
          status: "loading",
          message: "Approving token..."
        })

        const tokenContract = new web3Provider.eth.Contract(
          erc20Abi as any,
          tokenAddress
        )
        const approveTx = await tokenContract.methods
          .approve(BRIDGE_HYPERION_ADDRESS, amount.toString())
          .send({ from: address })

        setFeedback({
          status: "loading",
          message: `Token approved. Tx: ${approveTx.transactionHash}`
        })

        const destinationBytes32 = ethers.zeroPadValue(heliosEthAddress, 32)

        const hyperionContract = new web3Provider.eth.Contract(
          bridgeSendToHeliosAbi,
          BRIDGE_HYPERION_ADDRESS
        )
        const sendTx = await hyperionContract.methods
          .sendToHelios(
            tokenAddress,
            destinationBytes32,
            amount.toString(),
            "0x"
          )
          .send({
            from: address,
            gas: "500000"
          })

        const receipt = await web3Provider.eth.getTransactionReceipt(
          sendTx.transactionHash
        )

        setFeedback({
          status: "success",
          message: `Token sent to Helios in block ${receipt.blockNumber}`
        })

        return receipt
      } catch (error: unknown) {
        setFeedback({
          status: "error",
          message: getErrorMessage(error) || "Error during sendToHelios"
        })
        throw error
      }
    }
  })

  return {
    chains: qHyperionChains.data || [],
    tokens: qTokensByChain.data || [],
    heliosChainIndex: qHyperionChains.data?.findIndex(
      (chain) => chain.hyperionId === 0
    ),
    sendToChain: async (
      chainId: number,
      receiverAddress: string,
      tokenAddress: string,
      readableAmount: number,
      readableFees: number,
      decimals: number
    ) => {
      const amount = ethers.parseUnits(readableAmount.toString(), decimals)
      const fees = ethers.parseUnits(readableFees.toString(), decimals)
      return sendToChainMutation.mutateAsync({
        chainId,
        receiverAddress,
        tokenAddress,
        amount,
        fees
      })
    },
    sendToHelios: async (
      tokenAddress: string,
      heliosEthAddress: string,
      readableAmount: number,
      decimals: number
    ) => {
      const amount = ethers.parseUnits(readableAmount.toString(), decimals)
      return sendToHeliosMutation.mutateAsync({
        tokenAddress,
        heliosEthAddress,
        amount
      })
    },
    feedback,
    isLoading: sendToChainMutation.isPending || sendToHeliosMutation.isPending
  }
}
