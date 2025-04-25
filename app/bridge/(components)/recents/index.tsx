"use client"

import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import s from "./recents.module.scss"
import { useTransactionInfo } from "@/hooks/useTransactionInfo"
import { Transactions } from "@/components/transactions"
// import { useUserStore } from "@/stores/user"

export const Recents = () => {
  const { transactions } = useTransactionInfo(20)

  const bridgeTransactions = transactions.filter((tr) =>
    ["BRIDGE_IN", "BRIDGE_OUT"].includes(tr.ParsedInfo.type)
  )

  return (
    <Card className={s.recents}>
      <Heading
        icon="hugeicons:blockchain-05"
        title="Recent Bridge Transactions"
      ></Heading>
      <Transactions transactions={bridgeTransactions.slice(0, 3)} />
    </Card>
  )
}
