import { Badge } from "@/components/badge"
import { Blocks } from "@/components/blocks"
import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { generateGovernanceData } from "@/lib/faker"
import clsx from "clsx"
import s from "./governance.module.scss"

const Proposal = ({ item }: { item: any }) => {
  const status = item.result === "Passed" ? "success" : "danger"
  return (
    <div key={item.id} className={s.item} data-status={status}>
      <div className={s.left}>
        <div className={s.title}>
          <span className={s.id}>{item.id}:</span> <span>{item.title}</span>
        </div>
        <span className={clsx(s.result, s[item.result.toLowerCase()])}>
          Result: {item.result}
        </span>
      </div>
      <div className={s.details}>
        <Badge className={s.vote} status={status}>
          {item.vote}
        </Badge>
      </div>
    </div>
  )
}

export const Governance = () => {
  const data = generateGovernanceData()
  const blocks = [
    {
      title: "Participation Rate",
      value: "98%",
      bottom: "Of all proposals",
      color: "warning"
    },
    {
      title: "Voting Pattern",
      content: (
        <>
          <div className={s.pattern}>
            <div className={s.bar}>
              <div
                className={s.for}
                data-color="success"
                style={{ width: "70%" }}
              />
              <div
                className={s.against}
                data-color="danger"
                style={{ width: "30%" }}
              />
            </div>
            <div className={s.percent}>
              <span>70% For</span>
              <span>30% Against</span>
            </div>
          </div>
        </>
      )
    },
    {
      title: "Proposals Voted",
      value: "5",
      bottom: "Last 3 months"
    }
  ]

  return (
    <Card auto>
      <Heading
        icon="hugeicons:chart-breakout-circle"
        title="Governance Participation"
      />
      <Blocks items={blocks} />
      <div className={s.recents}>
        <h3>Recent Proposals</h3>
        {data.map((item) => (
          <Proposal key={item.id} item={item} />
        ))}
      </div>
    </Card>
  )
}
