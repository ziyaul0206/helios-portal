import { fromWeiToEther } from "@/utils/number"
import { TableCell, TableRow } from "../table"
import s from "./transactions.module.scss"
import { Transaction } from "@/types/transaction"
import { formatHash } from "@/utils/string"
import { EXPLORER_URL } from "@/config/app"

export const TransactionsLine = (transaction: Transaction) => {
  // const price = (
  //   <small className={s.small}>
  //     {formatCurrency(transaction.token.pricePerToken * transaction.amount)}
  //   </small>
  // )

  return (
    <TableRow>
      <TableCell>
        {/* <Category type={transaction.type} status={transaction.status} /> */}
        <a
          href={`${EXPLORER_URL}/tx/${transaction.hash}`}
          target="_blank"
          className={s.small}
        >
          {formatHash(transaction.hash)}
        </a>
      </TableCell>
      <TableCell className={s.cellFrom}>
        <a
          href={`${EXPLORER_URL}/tx/${transaction.from}`}
          target="_blank"
          className={s.small}
        >
          {transaction.from ? formatHash(transaction.from) : "0x0000...0000"}
        </a>
      </TableCell>
      <TableCell className={s.cellTo}>
        <a
          href={`${EXPLORER_URL}/tx/${transaction.to}`}
          target="_blank"
          className={s.small}
        >
          {transaction.to ? formatHash(transaction.to) : "0x0000...0000"}
        </a>
      </TableCell>
      <TableCell className={s.cellAmount}>
        <strong className={s.stronger}>
          {fromWeiToEther(transaction.value)} HELIOS
        </strong>
      </TableCell>
      {/* <TableCell>
        <small className={s.small}>
          {formatTimestamp(transaction.createdAt)}
        </small>
      </TableCell> */}
    </TableRow>
  )
}
