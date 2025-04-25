import { TransactionLast } from "@/types/transaction"
import { Table } from "../table"
import { TransactionsLine } from "./line"
import { Alert } from "@/app/(components)/alert"

interface TransactionsProps {
  transactions: TransactionLast[]
}

export const Transactions = ({ transactions }: TransactionsProps) => {
  if (transactions.length === 0) {
    return <Alert type="primary">No recent transactions.</Alert>
  }

  return (
    <Table>
      <tbody>
        {transactions.map((transaction) => (
          <TransactionsLine
            key={"transactions-" + transaction.RawTransaction.hash}
            {...transaction}
          />
        ))}
      </tbody>
    </Table>
  )
}
