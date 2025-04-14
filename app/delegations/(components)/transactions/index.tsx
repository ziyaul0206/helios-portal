import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Table, TableCell, TableRow } from "@/components/table"
import { generateTransactionsDelegations } from "@/lib/faker"
import { Row, TransactionDelegation } from "./row"
import s from "./transactions.module.scss"

export const Transactions = () => {
  const transactions = generateTransactionsDelegations(
    6
  ) as TransactionDelegation[]

  return (
    <Card className={s.transactions} auto>
      <Heading
        icon="hugeicons:arrow-data-transfer-vertical"
        title="Transactions History"
      />
      <Table>
        <thead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Validator</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Explorer</TableCell>
          </TableRow>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <Row key={index} {...transaction} />
          ))}
        </tbody>
      </Table>
    </Card>
  )
}
