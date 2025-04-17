import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import { TableCell, TableRow } from "@/components/table"
import { type TransactionDelegation } from "@/types/TransactionDelegation"
import { Variants } from "@/types/Variants"
import s from "./transactions.module.scss"

const STATUS_LABELS: Record<number, string> = {
  1: "Confirmed",
  2: "Unbonding",
  3: "Unbonded"
} as const

const TRANSACTION_LABELS: Record<number, string> = {
  1: "Stake",
  2: "Unstake",
  3: "Claim"
} as const

interface LabelProps {
  value: number
  labels: Record<number, string>
  variant?: Variants
  className?: string
  icon?: string
}

const Label = ({
  value,
  labels,
  variant = "primary",
  icon,
  className
}: LabelProps) => {
  const label = labels[value] || "Unknown"

  return (
    <Badge className={className} status={variant} icon={icon}>
      {label}
    </Badge>
  )
}

export const Row = ({
  type,
  validator,
  amount,
  status,
  date,
  explorer
}: TransactionDelegation) => {
  return (
    <TableRow className={s.row}>
      <TableCell>
        <Label
          value={type}
          labels={TRANSACTION_LABELS}
          variant={type === 1 ? "primary" : type === 2 ? "danger" : "success"}
          className={s.type}
          icon={
            type === 1
              ? "hugeicons:plus-sign-circle"
              : type === 2
              ? "hugeicons:minus-sign-circle"
              : "hugeicons:reverse-withdrawal-01"
          }
        />
      </TableCell>
      <TableCell>{validator}</TableCell>
      <TableCell>
        <div className={s.amount}>
          {amount} <Icon icon="helios" />
        </div>
      </TableCell>
      <TableCell>
        <Label
          value={status}
          labels={STATUS_LABELS}
          variant={
            status === 1 ? "success" : status === 2 ? "warning" : "danger"
          }
        />
      </TableCell>
      <TableCell className={s.date}>{date}</TableCell>
      <TableCell align="right" className={s.explorer}>
        <Button
          icon="hugeicons:link-square-02"
          href={explorer}
          className={s.link}
          variant="secondary"
          size="xsmall"
          border
        >
          View
        </Button>
      </TableCell>
    </TableRow>
  )
}
