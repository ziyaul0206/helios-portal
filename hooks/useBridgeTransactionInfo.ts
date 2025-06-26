// import { getLastTransactions } from "@/helpers/rpc-calls"
// import { secondsToMilliseconds, toHex } from "@/utils/number"
// import { useQuery } from "@tanstack/react-query"

// export const useBridgeTransactionInfo = (size = 10) => {
//   const qTransactions = useQuery({
//     queryKey: ["transactions", size],
//     queryFn: () => getLastTransactions(toHex(size)),
//     refetchInterval: secondsToMilliseconds(10)
//   })

//   return {
//     transactions: qTransactions.data || [],
//     isLoading: qTransactions.isLoading,
//     error: qTransactions.error
//   }
// }
