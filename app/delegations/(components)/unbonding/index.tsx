import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Message } from "@/components/message"
import s from "./unbonding.module.scss"

export const Unbonding = () => {
  return (
    <Card className={s.unbonding} auto>
      <Heading icon="hugeicons:clock-05" title="Unbonding Delegations" />
      <Message
        icon="hugeicons:information-circle"
        title="About Unbonding Period"
        variant="warning"
      >
        When you unstake your assets, they enter a 14-day unbonding period
        during which they cannot be transferred or used. You will not earn
        staking rewards during this time. This is a security measure to protect
        the network.
      </Message>
    </Card>
  )
}
