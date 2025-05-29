import { useQuery } from "@tanstack/react-query"
import { getValidatorsByPageAndSize } from "@/helpers/rpc-calls"
import { toHex } from "@/utils/number"

export const useValidators = (page = 1, size = 100) => {
  const qValidators = useQuery({
    queryKey: ["validators", page, size],
    queryFn: () => getValidatorsByPageAndSize(toHex(page), toHex(size)),
    enabled: !!page && !!size
  })

  return {
    validators: qValidators.data || [],
    isLoading: qValidators.isLoading,
    error: qValidators.error
  }
}
