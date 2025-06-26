import { Token } from "./Tokens"
import { TransactionLastType } from "./transaction"

export type TransactionStatus = "pending" | "completed" | "failed"

export interface Transaction {
  id: string
  type: TransactionLastType
  token: Token
  amount: number
  date: string
  status: TransactionStatus
}
