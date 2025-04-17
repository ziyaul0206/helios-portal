"use client"

import { Variants } from "@/types/Variants"
import clsx from "clsx"
import s from "./badge.module.scss"

interface BadgeProps {
  children: React.ReactNode
  status?: Variants
  className?: string
}

export const Badge = ({
  children,
  status = "primary",
  className
}: BadgeProps) => {
  return (
    <div className={clsx(s.badge, className)} data-status={status}>
      {children}
    </div>
  )
}
