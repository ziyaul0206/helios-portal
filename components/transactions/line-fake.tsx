import { TableCell, TableRow } from "../table"
import s from "./transactions.module.scss"

export const TransactionsLineFake = () => {
  return (
    <TableRow>
      <TableCell>
        <span className={s.small}>0x000...000</span>
      </TableCell>
      <TableCell className={s.cellFrom}>
        <span className={s.small}>0x000...000</span>
      </TableCell>
      <TableCell className={s.cellTo}>
        <span className={s.small}>0x000...000</span>
      </TableCell>
      <TableCell className={s.cellAmount}>
        <strong className={s.stronger}>0 HELIOS</strong>
      </TableCell>
    </TableRow>
  )
}
