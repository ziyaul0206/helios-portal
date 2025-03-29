import { getTransactionsByPageAndSize } from "@/helpers/rpc-calls"
import { secondsToMilliseconds, toHex } from "@/utils/number"
import { useQuery } from "@tanstack/react-query"

export const useTransactionInfo = (page = 1, size = 3) => {
  const qTransactions = useQuery({
    queryKey: ["transactions", page, size],
    queryFn: () => getTransactionsByPageAndSize(toHex(page), toHex(size)),
    refetchInterval: secondsToMilliseconds(10)
  })

  return {
    transactions: qTransactions.data || [],
    isLoading: qTransactions.isLoading,
    error: qTransactions.error
  }
}
