import { fromWeiToEther } from "@/utils/number"
import { TableCell, TableRow } from "../table"
import s from "./transactions.module.scss"
import { TransactionBridgeLight } from "@/types/transaction"
import { EXPLORER_URL } from "@/config/app"
import Category from "./category"
import { Button } from "../button"

export const TransactionsLine = (transaction: TransactionBridgeLight) => {
  // const price = (
  //   <small className={s.small}>
  //     {formatCurrency(transaction.token.pricePerToken * transaction.amount)}
  //   </small>
  // )

  const explorerLink = EXPLORER_URL + "/tx/" + transaction.hash

  return (
    <TableRow>
      <TableCell>
        <Category type={transaction.type} />
      </TableCell>
      {/* <TableCell>
      <small className={s.small}>
        {formatRelativeDate(transaction.date)}
      </small>
    </TableCell> */}

      <TableCell className={s.cellAmount}>
        {transaction.amount && (
          <strong className={s.stronger}>
            {fromWeiToEther(transaction.amount)}{" "}
            {transaction.token?.display.symbol.toUpperCase()}
          </strong>
        )}
      </TableCell>
      <TableCell align="right" className={s.cellRight}>
        <Button
          icon="hugeicons:link-square-02"
          variant="secondary"
          border
          href={explorerLink}
        />
      </TableCell>
    </TableRow>
  )
}
