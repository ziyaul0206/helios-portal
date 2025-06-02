import { TableCell, TableRow } from "../table"
import s from "./transactions.module.scss"
import { TransactionLight } from "@/types/transaction"
import { EXPLORER_URL } from "@/config/app"
import Category from "./category"
import { Button } from "../button"
import { Symbol } from "@/components/symbol"
import { ethers } from "ethers"

export const TransactionsLine = (transaction: TransactionLight) => {
  const explorerLink = EXPLORER_URL + "/tx/" + transaction.hash

  return (
    <TableRow>
      <TableCell>
        <Category type={transaction.type} />
      </TableCell>

      <TableCell className={s.cellAmount}>
        {transaction.amount && (
          <>
            <strong className={s.stronger}>
              {transaction.token && (
                <Symbol
                  icon={transaction.token.display.symbolIcon}
                  color={transaction.token.display.color}
                />
              )}
              {ethers.formatUnits(
                transaction.amount,
                transaction.token?.functionnal.decimals
              )}{" "}
              {transaction.token?.display.symbol.toUpperCase()}
            </strong>
          </>
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
