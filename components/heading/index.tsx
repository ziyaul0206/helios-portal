import clsx from "clsx"
import { Icon } from "../icon"
import s from "./heading.module.scss"

interface HeadingProps {
  icon?: string
  title?: string
  description?: string | React.ReactNode
  className?: string
  rightClassName?: string
  children?: React.ReactNode
  verified?: boolean
}

export const Heading = ({
  icon,
  title,
  description,
  className,
  rightClassName,
  children,
  verified
}: HeadingProps) => {
  return (
    <div className={clsx(s.heading, className)}>
      {icon && (
        <div className={s.icon}>
          <Icon icon={icon} />
        </div>
      )}
      {(title || description) && (
        <div className={s.content}>
          {title && (
            <h2 className={s.title}>
              {title}
              {verified && <Icon icon="hugeicons:checkmark-badge-02" />}
            </h2>
          )}
          {description && <div className={s.description}>{description}</div>}
        </div>
      )}
      <div className={clsx(s.right, rightClassName)}>{children}</div>
    </div>
  )
}
