import { fromWeiToEther } from "@/utils/number"
import { TableCell, TableRow } from "../table"
import s from "./transactions.module.scss"
import { TransactionLast } from "@/types/transaction"
import { formatHash } from "@/utils/string"
import { EXPLORER_URL } from "@/config/app"
import Category from "./category"
import { formatRelativeDate } from "@/lib/utils/date"
import { formatBigNumber, formatCurrency } from "@/lib/utils/number"
import { Button } from "../button"

export const TransactionsLine = (transaction: TransactionLast) => {
  // const price = (
  //   <small className={s.small}>
  //     {formatCurrency(transaction.token.pricePerToken * transaction.amount)}
  //   </small>
  // )

  const explorerLink = EXPLORER_URL + "/tx/" + transaction.RawTransaction.hash

  return (
    <TableRow>
      <TableCell>
        <Category type={transaction.ParsedInfo.type} />
      </TableCell>
      {/* <TableCell>
      <small className={s.small}>
        {formatRelativeDate(transaction.date)}
      </small>
    </TableCell> */}

      <TableCell className={s.cellAmount}>
        {transaction.ParsedInfo.amount && (
          <strong className={s.stronger}>
            {fromWeiToEther(transaction.ParsedInfo.amount)}{" "}
            {transaction.ParsedInfo.denom?.toUpperCase()}
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
