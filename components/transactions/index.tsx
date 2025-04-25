import { TransactionLast } from "@/types/transaction"
import { Table } from "../table"
import { TransactionsLine } from "./line"
import { TransactionsLineFake } from "./line-fake"

interface TransactionsProps {
  transactions: TransactionLast[]
}

export const Transactions = ({ transactions }: TransactionsProps) => {
  return (
    <Table>
      <tbody>
        {transactions.length === 0 &&
          [...Array(3)].map((_, index) => <TransactionsLineFake key={index} />)}
        {transactions.map((transaction) => (
          <TransactionsLine
            key={"transactions-" + transaction.RawTransaction.blockHash}
            {...transaction}
          />
        ))}
      </tbody>
    </Table>
  )
}
