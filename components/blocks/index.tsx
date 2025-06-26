import clsx from "clsx"
import s from "./blocks.module.scss"
import { Variants } from "@/types/feedback"

interface BlocksProps {
  className?: string
  vertical?: boolean
  items: {
    title: string
    value?: string | React.ReactNode
    bottom?: string
    color?: Variants | string
    content?: React.ReactNode
  }[]
}

export const Blocks = ({ items, className, vertical }: BlocksProps) => {
  return (
    <div className={clsx(s.blocks, className, vertical && s.vertical)}>
      {items.map(({ title, value, bottom, color, content }, index) => (
        <div className={s.block} data-color={color} key={index}>
          <span>{title}</span>
          {value && <strong>{value}</strong>}
          {bottom && (
            <div className={s.bottom}>
              <small>{bottom}</small>
            </div>
          )}
          {content && content}
        </div>
      ))}
    </div>
  )
}
