import { Icon } from "@/components/icon"
import s from "./stats.module.scss"

interface StatProps {
  title: string
  icon: string
  children: React.ReactNode
  bottom: React.ReactNode
}

export const Stat = ({ title, icon, children, bottom }: StatProps) => {
  return (
    <div className={s.stat}>
      <div className={s.icon}>
        <Icon icon={icon} />
      </div>
      <h2>{title}</h2>
      <div className={s.content}>{children}</div>
      <div className={s.bottom}>{bottom}</div>
    </div>
  )
}
