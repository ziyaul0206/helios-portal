import { Badge } from "@/components/badge"
import { Icon } from "@/components/icon"
import { STATUS_CONFIG, VOTE_CONFIG } from "@/config/vote"
import { type VoteProps } from "@/types/faker"
import clsx from "clsx"
import s from "./history.module.scss"

export const Vote = ({ item }: { item: VoteProps }) => {
  const { color, icon } = STATUS_CONFIG[item.status]
  const { color: voteColor, icon: voteIcon } = VOTE_CONFIG[item.vote]

  return (
    <div className={clsx(s.item, s[item.status])}>
      <div className={s.top}>
        <Badge status={color} icon={icon}>
          {item.status}
        </Badge>
        <div className={s.hip}>HIP-{item.hip}</div>
        <time dateTime={item.date} className={s.date}>
          <Icon icon="hugeicons:clock-04" />
          {item.date}
        </time>
        <div className={s.vote} data-color={voteColor}>
          <Icon icon={voteIcon} />
          Voted {item.vote}
        </div>
      </div>
      <h3 className={s.name}>{item.name}</h3>
    </div>
  )
}
