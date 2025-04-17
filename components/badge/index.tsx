"use client"

import { Variants } from "@/types/Variants"
import clsx from "clsx"
import { Icon } from "../icon"
import s from "./badge.module.scss"

interface BadgeProps {
  children: React.ReactNode
  icon?: string
  status?: Variants
  className?: string
}

export const Badge = ({
  children,
  icon,
  status = "primary",
  className
}: BadgeProps) => {
  return (
    <div className={clsx(s.badge, className)} data-status={status}>
      {icon && <Icon icon={icon} className={s.icon} />}
      {children}
    </div>
  )
}
