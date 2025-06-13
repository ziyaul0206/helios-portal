import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Table, TableCell, TableRow } from "@/components/table"
// import { generateTransactionsDelegations } from "@/lib/faker"
import { TransactionDelegation } from "@/types/TransactionDelegation"
import { Row } from "./row"
import s from "./transactions.module.scss"
import { useAccountLastTransactions } from "@/hooks/useAccountLastTransactions"
// import { takeCoverage } from "v8"
import { EXPLORER_URL } from "@/config/app"
import { Message } from "@/components/message"

export const Transactions = () => {
  // const transactions = generateTransactionsDelegations(
  //   6
  // ) as TransactionDelegation[]
  const { transactions } = useAccountLastTransactions()

  const formattedTxs: TransactionDelegation[] = transactions.map((tx) => ({
    type: tx.type,
    amount: tx.amount || 0,
    explorer: `${EXPLORER_URL}/tx/${tx.hash}`,
    symbol: tx.token?.display.symbol || "",
    symbolIcon: tx.token?.display.symbolIcon || "",
    logo: tx.token?.display.logo || "",
    color: tx.token?.display.color || ""
  }))

  if (transactions.length === 0) {
    return
  }

  return (
    <Card className={s.transactions} auto>
      <Heading
        icon="hugeicons:arrow-data-transfer-vertical"
        title="Transactions History"
      />
      {formattedTxs.length === 0 ? (
        <Message title="Transactions informations" variant="primary">
          No recent transactions.
        </Message>
      ) : (
        <Table>
          <thead>
            <TableRow>
              <TableCell>Type</TableCell>
              {/* <TableCell>Validator</TableCell> */}
              <TableCell>Amount</TableCell>
              {/* <TableCell>Status</TableCell> */}
              {/* <TableCell>Date</TableCell> */}
              <TableCell align="right">Explorer</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {formattedTxs.map((transaction, index) => (
              <Row key={index} {...transaction} />
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  )
}
