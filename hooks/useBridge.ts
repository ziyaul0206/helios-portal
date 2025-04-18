import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
  getHyperionAccountTransferTxsByPageAndSize,
  getHyperionChains,
  getTokensByChainIdAndPageAndSize
} from "@/helpers/rpc-calls"
import { toHex } from "viem"
import { secondsToMilliseconds } from "date-fns"

export const useBridge = () => {
  const { address } = useAccount()
  const web3Provider = useWeb3Provider()
  const chainId = useChainId()
  const queryClient = useQueryClient()

  const [lastReceiverAddress, setLastReceiverAddress] = useState("")
  const [txHashInProgress, setTxHashInProgress] = useState("")

  const qHyperionChains = useQuery({
    queryKey: ["hyperionChains"],
    queryFn: getHyperionChains
  })

  const qHyperionBridgeTxs = useQuery({
    queryKey: ["hyperionBridgeTxs"],
    queryFn: () =>
      getHyperionAccountTransferTxsByPageAndSize(
        lastReceiverAddress,
        toHex(1),
        toHex(10)
      ),
    enabled: lastReceiverAddress !== "",
    refetchInterval: secondsToMilliseconds(10)
  })

  const [feedback, setFeedback] = useState({
    status: "idle",
    message: ""
  })

  const loadTokensByChain = async (chainId: number) => {
    return queryClient.fetchQuery({
      queryKey: ["tokensByChain", chainId],
      queryFn: () =>
        getTokensByChainIdAndPageAndSize(chainId, toHex(1), toHex(10))
    })
  }

  // 🟡 sendToChain
  const sendToChain = async (
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
  }
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

        setTxHashInProgress(tx.transactionHash)
        setLastReceiverAddress(receiverAddress)

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
  const sendToHelios = async (
    receiverAddress: string,
    tokenAddress: string,
    readableAmount: number,
    readableFees: number,
    decimals: number
  ) => {
    const amount = ethers.parseUnits(readableAmount.toString(), decimals)
    const fees = ethers.parseUnits(readableFees.toString(), decimals)
    const amountWithFees = amount + fees

    return sendToHeliosMutation.mutateAsync({
      receiverAddress,
      tokenAddress,
      amountWithFees
    })
  }

  const sendToHeliosMutation = useMutation({
    mutationFn: async ({
      receiverAddress,
      tokenAddress,
      amountWithFees
    }: {
      receiverAddress: string
      tokenAddress: string
      amountWithFees: bigint
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
        const chainContractAddress = qHyperionChains.data?.find(
          (chain) => chain.chainId === chainId
        )?.hyperionContractAddress
        if (!chainContractAddress) return

        const approveTx = await tokenContract.methods
          .approve(chainContractAddress, amountWithFees.toString())
          .send({ from: address })

        setFeedback({
          status: "loading",
          message: `Token approved. Tx: ${approveTx.transactionHash}`
        })

        const destinationBytes32 = ethers.zeroPadValue(receiverAddress, 32)

        const hyperionContract = new web3Provider.eth.Contract(
          bridgeSendToHeliosAbi,
          BRIDGE_HYPERION_ADDRESS
        )
        const tx = await hyperionContract.methods
          .sendToHelios(
            tokenAddress,
            destinationBytes32,
            amountWithFees.toString(),
            ""
          )
          .send({
            from: address,
            gas: "500000"
          })

        setTxHashInProgress(tx.transactionHash)
        setLastReceiverAddress(receiverAddress)

        const receipt = await web3Provider.eth.getTransactionReceipt(
          tx.transactionHash
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

  const txInProgress = qHyperionBridgeTxs.data?.find(
    (tx) => tx.txHash === txHashInProgress
  )

  return {
    chains: qHyperionChains.data || [],
    heliosChainIndex: qHyperionChains.data?.findIndex(
      (chain) => chain.hyperionId === 0
    ),
    txInProgress,
    sendToChain,
    loadTokensByChain,
    sendToHelios,
    feedback,
    isLoading: sendToChainMutation.isPending || sendToHeliosMutation.isPending
  }
}
