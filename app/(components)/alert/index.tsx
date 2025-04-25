"use client"

import s from "./alert.module.scss"
import { Icon } from "@/components/icon"

export type AlertType = "success" | "warning" | "danger" | "primary"

interface AlertProps {
  type: AlertType
  children: string
}

const iconByType: Record<AlertType, string> = {
  success: "hugeicons:checkmark-circle-02",
  warning: "hugeicons:alert-diamond",
  danger: "hugeicons:alert-02",
  primary: "hugeicons:information-circle"
}

export const Alert = ({ type, children }: AlertProps) => {
  return (
    <div className={s.alert} data-status={type}>
      <Icon icon={iconByType[type]} className={s.icon} />
      <div
        className={s.content}
        dangerouslySetInnerHTML={{ __html: children }}
      ></div>
    </div>
  )
}
