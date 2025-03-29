import { Transaction } from "@/types/transaction"
import { Table, TableCell, TableRow } from "../table"
import { TransactionsLine } from "./line"
import s from "./transactions.module.scss"
import { TransactionsLineFake } from "./line-fake"

interface TransactionsProps {
  transactions: Transaction[]
}

export const Transactions = ({ transactions }: TransactionsProps) => {
  return (
    <Table>
      <thead>
        <TableRow>
          <TableCell>Tx Hash</TableCell>
          <TableCell className={s.cellFrom}>From</TableCell>
          <TableCell className={s.cellTo}>To</TableCell>
          <TableCell className={s.cellAmount}>Value</TableCell>
        </TableRow>
      </thead>
      <tbody>
        {transactions.length === 0 &&
          [...Array(3)].map((_, index) => <TransactionsLineFake key={index} />)}
        {transactions.map((transaction) => (
          <TransactionsLine key={transaction.hash} {...transaction} />
        ))}
      </tbody>
    </Table>
  )
}
