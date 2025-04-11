import clsx from "clsx"
import s from "./card.module.scss"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  auto?: boolean
}

export const SkeletonCard = ({ children, auto, ...props }: CardProps) => {
  return (
    <div {...props} className={clsx(s.card, props.className, auto && s.auto)}>
      <div className={s.top}>
        <div className={s.icon} data-loading />
        <div className={s.heading} data-loading />
      </div>
      {children ? children : <div className={s.content} data-loading />}
    </div>
  )
}
