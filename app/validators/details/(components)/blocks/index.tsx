import s from "./blocks.module.scss"

interface BlocksProps {
  items: {
    title: string
    value: string
    bottom: string
    color?: string
  }[]
}

export const Blocks = ({ items }: BlocksProps) => {
  return (
    <div className={s.blocks}>
      {items.map(({ title, value, bottom, color }, index) => (
        <div className={s.block} data-color={color} key={index}>
          <span>{title}</span>
          <strong>{value}</strong>
          <small>{bottom}</small>
        </div>
      ))}
    </div>
  )
}
