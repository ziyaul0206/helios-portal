import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import { useState } from "react"
import { useWeb3Provider } from "./useWeb3Provider"
import { ethers } from "ethers"
import { getErrorMessage } from "@/utils/string"
import { Feedback } from "@/types/feedback"

const voteAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address"
      },
      {
        internalType: "uint64",
        name: "proposalId",
        type: "uint64"
      },
      {
        internalType: "enum VoteOption",
        name: "option",
        type: "uint8"
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string"
      }
    ],
    name: "vote",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
]

const GOVERNANCE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000805"

export const useVote = () => {
  const { address } = useAccount()
  const web3Provider = useWeb3Provider()
  const queryClient = useQueryClient()
  const [feedback, setFeedback] = useState<Feedback>({
    status: "primary",
    message: ""
  })

  const resetFeedback = () => {
    setFeedback({ status: "primary", message: "" })
  }

  const voteMutation = useMutation({
    mutationFn: async ({
      proposalId,
      option,
      metadata
    }: {
      proposalId: number
      option: number
      metadata: string
    }) => {
      if (!web3Provider) throw new Error("No wallet connected")

      try {
        console.log("Vote in progress...")
        setFeedback({
          status: "primary",
          message: "Vote transaction in progress..."
        })

        // Create web3 contract instance (following your delegate pattern)
        const contract = new web3Provider.eth.Contract(
          voteAbi,
          GOVERNANCE_CONTRACT_ADDRESS
        )

        // Call first to check if transaction will succeed
        await contract.methods
          .vote(address, proposalId, option, metadata)
          .call({
            from: address
          })

        // Send the transaction
        const tx = await contract.methods
          .vote(address, proposalId, option, metadata)
          .send({
            from: address
          })

        console.log("Transaction sent, hash:", tx.transactionHash)

        setFeedback({
          status: "primary",
          message: `Transaction sent, waiting for confirmation...`
        })

        // Wait for transaction receipt
        const receipt = await web3Provider.eth.getTransactionReceipt(
          tx.transactionHash
        )
        console.log("Transaction confirmed in block:", receipt.blockNumber)

        return receipt
      } catch (error: any) {
        console.error("Error during vote submission:", error)
        const errorMessage =
          getErrorMessage(error) || "Error during vote submission"
        setFeedback({
          status: "danger",
          message: errorMessage
        })
        throw error
      }
    },
    onError: (error: any) => {
      console.log(error.data.message)
      // Additional error handling to ensure feedback is set correctly
      console.error("Mutation error:", error)
      setFeedback({
        status: "danger",
        message: getErrorMessage(error) || "Error during vote submission"
      })
    }
  })

  const vote = async (
    proposalId: number,
    option: number,
    metadata: string = ""
  ) => {
    try {
      await voteMutation.mutateAsync({
        proposalId,
        option,
        metadata: metadata || `Vote on proposal ${proposalId}`
      })

      setFeedback({
        status: "success",
        message: `Vote submitted successfully! Refreshing data...`
      })
      console.log("Vote successfully submitted!")

      // Refetch relevant queries
      await queryClient.refetchQueries({ queryKey: ["proposals"] })
      await queryClient.refetchQueries({ queryKey: ["proposal", proposalId] })
      await queryClient.refetchQueries({ queryKey: ["userVotes", address] })
      await queryClient.refetchQueries({
        queryKey: ["accountLastTxs", address]
      })
    } catch (error) {
      // Error is already handled in the mutation, but we can add additional logic here if needed
      console.error("Vote submission failed:", error)
    }
  }

  return {
    vote,
    feedback,
    resetFeedback,
    isLoading: voteMutation.isPending
  }
}
