"use client"

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Transactions } from "@/components/transactions"
import { useTransactionInfo } from "@/hooks/useTransactionInfo"

export const Recents = () => {
  const { transactions } = useTransactionInfo()

  // console.log(transactions)

  return (
    <Card>
      <Heading icon="hugeicons:blockchain-05" title="Recent Transactions">
        <Button icon="hugeicons:arrow-right-01" variant="secondary" border />
      </Heading>
      <Transactions transactions={transactions} />
    </Card>
  )
}
