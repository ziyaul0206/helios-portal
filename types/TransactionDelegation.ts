import { TransactionLastType } from "./transaction"

export interface TransactionDelegation {
  type: TransactionLastType
  // validator: string
  amount: number
  // status: number
  // date: string
  explorer: string
  symbolIcon: string
}
