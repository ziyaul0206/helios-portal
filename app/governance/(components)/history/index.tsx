import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Message } from "@/components/message"
import { generateVotes } from "@/lib/faker"
import s from "./history.module.scss"
import { Vote } from "./vote"

export const History = () => {
  const list = generateVotes(6)

  return (
    <Card className={s.history} auto>
      <Heading icon="hugeicons:clock-04" title="Your Voting History" />
      <div className={s.list}>
        {list.map((item) => (
          <Vote key={item.hip} item={item} />
        ))}
      </div>
      <Message
        title="Voting Power Delegation"
        icon="hugeicons:information-circle"
        variant="warning"
      >
        When you stake with a validator, your voting power is delegated to them
        by default. You can override this by voting directly on proposals, which
        will supersede your validator&apos;s vote.
      </Message>
    </Card>
  )
}
