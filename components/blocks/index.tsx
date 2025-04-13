import { type Variants } from "@/types/Variants"
import s from "./blocks.module.scss"

interface BlocksProps {
  items: {
    title: string
    value?: string
    bottom?: string
    color?: Variants | string
    content?: React.ReactNode
  }[]
}

export const Blocks = ({ items }: BlocksProps) => {
  return (
    <div className={s.blocks}>
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
