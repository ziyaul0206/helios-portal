import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { Link } from "@/components/link"
import { Message } from "@/components/message"
import { Progress } from "@/components/progress"
import s from "./unbonding.module.scss"

export const Unbonding = () => {
  const list = [
    {
      name: "Quantum Nodes",
      url: "/validators/details",
      hls: 300,
      progress: 30
    },
    {
      name: "Blockchain Sentinels",
      url: "/validators/details",
      hls: 500,
      progress: 15
    }
  ]

  return (
    <Card className={s.unbonding} auto>
      <Heading icon="hugeicons:clock-05" title="Unbonding Delegations" />
      <div className={s.list}>
        {list.map((item, index) => (
          <Link href={item.url} className={s.item} key={index}>
            <div className={s.top}>
              <div className={s.icon}></div>
              <div className={s.left}>
                <h3>{item.name}</h3>
                <div className={s.amount}>
                  <Icon icon="helios" /> {item.hls} <small>($1,000)</small>
                </div>
              </div>
              <div className={s.right}>
                <span>Completes on</span>
                <strong>Mon, 15 Apr 2025</strong>
              </div>
            </div>
            <Progress value={item.progress} max={100} data-color="primary" />
            <div className={s.bottom}>
              <span>Unbonding Progress</span>
              <strong>{item.progress}%</strong>
            </div>
          </Link>
        ))}
      </div>
      <Message
        icon="hugeicons:information-circle"
        title="About Unbonding Period"
      >
        When you unstake your assets, they enter a 14-day unbonding period
        during which they cannot be transferred or used. You will not earn
        staking rewards during this time. This is a security measure to protect
        the network.
      </Message>
    </Card>
  )
}
