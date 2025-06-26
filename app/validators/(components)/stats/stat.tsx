import { Icon } from "@/components/icon"
import s from "./stats.module.scss"

interface StatProps {
  title: string
  subtitle?: string
  icon: string
  children: React.ReactNode
  bottom?: React.ReactNode
}

export const Stat = ({
  title,
  subtitle,
  icon,
  children,
  bottom
}: StatProps) => {
  return (
    <div className={s.stat}>
      <div className={s.icon}>
        <Icon icon={icon} />
      </div>
      <h2>{title}</h2>
      {subtitle && <div className={s.subtitle}>{subtitle}</div>}
      <div className={s.content}>{children}</div>
      {bottom && <div className={s.bottom}>{bottom}</div>}
    </div>
  )
}
