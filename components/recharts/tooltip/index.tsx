import clsx from "clsx"
import s from "./tooltip.module.scss"

interface RechartsTooltipProps {
  children: React.ReactNode
  className?: string
}

export const RechartsTooltip = ({
  children,
  className
}: RechartsTooltipProps) => {
  return <div className={clsx(s.tooltip, className)}>{children}</div>
}
