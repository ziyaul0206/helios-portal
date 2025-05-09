import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAccount } from "wagmi"
import {
  DELEGATE_CONTRACT_ADDRESS,
  delegateAbi
} from "@/constant/helios-contracts"
import { useState } from "react"
import { useWeb3Provider } from "./useWeb3Provider"
import { ethers } from "ethers"
import { getErrorMessage } from "@/utils/string"
import { AlertType } from "@/app/(components)/alert"

export const useDelegate = () => {
  const { address } = useAccount()
  const web3Provider = useWeb3Provider()
  const queryClient = useQueryClient()
  const [feedback, setFeedback] = useState({
    status: "idle" as AlertType,
    message: ""
  })
  const resetFeedback = () => {
    setFeedback({ status: "idle", message: "" })
  }

  const delegateMutation = useMutation({
    mutationFn: async ({
      validatorAddress,
      amount,
      symbol,
      decimals
    }: {
      validatorAddress: string
      amount: string
      symbol: string
      decimals: number
    }) => {
      if (!web3Provider) throw new Error("No wallet connected")
      try {
        const delegateAmount = ethers.parseUnits(amount, decimals)

        setFeedback({ status: "primary", message: "Delegation in progress..." })
        const contract = new web3Provider.eth.Contract(
          delegateAbi,
          DELEGATE_CONTRACT_ADDRESS
        )

        await contract.methods
          .delegate(address, validatorAddress, delegateAmount, symbol)
          .call({
            from: address,
            gas: "500000"
          })

        const tx = await contract.methods
          .delegate(address, validatorAddress, delegateAmount, symbol)
          .send({
            from: address,
            gas: "500000"
          })

        setFeedback({
          status: "primary",
          message: `Transaction sent, waiting for confirmation...`
        })

        const receipt = await web3Provider.eth.getTransactionReceipt(
          tx.transactionHash
        )

        return receipt
      } catch (error: any) {
        setFeedback({
          status: "danger",
          message: getErrorMessage(error) || "Error during delegation"
        })
        throw error
      }
    }
  })

  const undelegateMutation = useMutation({
    mutationFn: async ({
      validatorAddress,
      amount,
      symbol,
      decimals
    }: {
      validatorAddress: string
      amount: string
      symbol: string
      decimals: number
    }) => {
      if (!web3Provider) throw new Error("No wallet connected")

      try {
        const undelegateAmount = ethers.parseUnits(amount, decimals)

        setFeedback({
          status: "primary",
          message: "Undelegation in progress..."
        })

        const contract = new web3Provider.eth.Contract(
          delegateAbi,
          DELEGATE_CONTRACT_ADDRESS
        )

        await contract.methods
          .undelegate(address, validatorAddress, undelegateAmount, symbol)
          .call({
            from: address,
            gas: "500000"
          })

        const tx = await contract.methods
          .undelegate(address, validatorAddress, undelegateAmount, symbol)
          .send({
            from: address,
            gas: "500000"
          })

        setFeedback({
          status: "primary",
          message: `Transaction sent, waiting for confirmation...`
        })

        const receipt = await web3Provider.eth.getTransactionReceipt(
          tx.transactionHash
        )

        return receipt
      } catch (error: any) {
        setFeedback({
          status: "danger",
          message: getErrorMessage(error) || "Error during undelegation"
        })
        throw error
      }
    }
  })

  const delegate = async (
    validatorAddress: string,
    amount: string,
    symbol: string,
    decimals: number
  ) => {
    await delegateMutation.mutateAsync({
      validatorAddress,
      amount,
      symbol,
      decimals
    })

    setFeedback({
      status: "success",
      message: `Delegation successful ! Refreshing your delegations...`
    })

    await queryClient.refetchQueries({ queryKey: ["delegations", address] })
    await queryClient.refetchQueries({ queryKey: ["accountLastTxs", address] })
    await queryClient.refetchQueries({ queryKey: ["whitelistedAssets"] })
  }

  const undelegate = async (
    validatorAddress: string,
    amount: string,
    symbol: string,
    decimals: number
  ) => {
    await undelegateMutation.mutateAsync({
      validatorAddress,
      amount,
      symbol,
      decimals
    })

    setFeedback({
      status: "success",
      message: `Undelegation successful! Refreshing your delegations...`
    })

    await queryClient.refetchQueries({ queryKey: ["delegations", address] })
    await queryClient.refetchQueries({ queryKey: ["accountLastTxs", address] })
    await queryClient.refetchQueries({ queryKey: ["whitelistedAssets"] })
  }

  return {
    delegate,
    undelegate,
    feedback,
    resetFeedback,
    isLoading: delegateMutation.isPending || undelegateMutation.isPending
  }
}
