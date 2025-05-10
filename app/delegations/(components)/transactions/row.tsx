import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Symbol } from "@/components/symbol"
import { TableCell, TableRow } from "@/components/table"
import s from "./transactions.module.scss"
import { TransactionLastType } from "@/types/transaction"
import { formatNumber } from "@/lib/utils/number"
import { Variants } from "@/types/feedback"

const TRANSACTION_LABELS: Record<
  TransactionLastType,
  { label: string; variant: Variants; icon: string }
> = {
  BRIDGE_OUT: {
    label: "Bridge Out",
    variant: "danger",
    icon: "hugeicons:arrow-left-up-03"
  },
  BRIDGE_IN: {
    label: "Bridge In",
    variant: "success",
    icon: "hugeicons:arrow-down-right-03"
  },
  STAKE_IN: {
    label: "Stake",
    variant: "primary",
    icon: "hugeicons:plus-sign-circle"
  },
  STAKE_OUT: {
    label: "Unstake",
    variant: "warning",
    icon: "hugeicons:minus-sign-circle"
  },
  GOVERNANCE_VOTE: {
    label: "Vote",
    variant: "primary",
    icon: "hugeicons:vote"
  },
  DEPOSIT: {
    label: "Deposit",
    variant: "primary",
    icon: "hugeicons:download-02"
  },
  WITHDRAW: {
    label: "Withdraw",
    variant: "warning",
    icon: "hugeicons:upload-02"
  },
  UNKNOWN: {
    label: "Unknown",
    variant: "secondary",
    icon: "hugeicons:help-hexagon"
  }
}

interface TransactionRowProps {
  type: TransactionLastType
  amount?: number
  symbol?: string
  symbolIcon?: string
  color?: string
  explorer: string
  date?: string
  from?: string
  to?: string
}

export const Row = ({
  type,
  amount,
  symbol,
  symbolIcon,
  color,
  explorer
}: TransactionRowProps) => {
  const { label, variant, icon } = TRANSACTION_LABELS[type]

  return (
    <TableRow className={s.row}>
      <TableCell>
        <Badge status={variant} icon={icon} className={s.type}>
          {label}
        </Badge>
      </TableCell>
      <TableCell>
        <div className={s.amount}>
          {symbolIcon && <Symbol icon={symbolIcon} color={color} />}
          {formatNumber(amount || 0, 6)} {symbol?.toUpperCase()}
        </div>
      </TableCell>
      {/* <TableCell className={s.date}>{date || "-"}</TableCell> */}
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
