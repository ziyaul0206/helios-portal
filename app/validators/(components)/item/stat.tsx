import { Icon } from "@/components/icon"
import clsx from "clsx"
import s from "./item.module.scss"

interface StatItemProps {
  icon: string
  label: string
  value: string
  bottom?: string
  className?: string
  color: "apy" | "reputation" | "uptime" | "commission"
}

export const StatItem = ({
  icon,
  label,
  value,
  bottom,
  className,
  color
}: StatItemProps) => {
  return (
    <div className={clsx(s.stat, className)} data-color={color}>
      <Icon icon={icon} className={s.icon} />
      <span>{label}</span>
      <strong>{value}</strong>
      {bottom && <small className={s.bottom}>{bottom}</small>}
    </div>
  )
}
