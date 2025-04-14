import { clsx } from "clsx"
import s from "./label.module.scss"

interface LabelProps {
  value: number
  labels: Record<number, string>
  variant?: "primary" | "success" | "warning" | "danger"
  className?: string
}

export const Label = ({
  value,
  labels,
  variant = "primary",
  className
}: LabelProps) => {
  const label = labels[value] || "Unknown"

  return <span className={clsx(s.label, s[variant], className)}>{label}</span>
}
