import clsx from "clsx"
import { Icon } from "../icon"
import s from "./message.module.scss"
import { Variants } from "@/types/feedback"

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string
  title: string
  children: React.ReactNode
  nobreak?: boolean
  variant?: Variants
}

export const Message = ({
  variant = "primary",
  icon,
  title,
  nobreak,
  children,
  ...props
}: MessageProps) => {
  return (
    <div
      {...props}
      data-color={variant}
      className={clsx(s.message, props.className)}
    >
      <div className={s.title}>
        {icon && <Icon icon={icon} />}
        {title}
      </div>
      <div className={s.content} data-nobreak={nobreak}>
        {children}
      </div>
    </div>
  )
}
