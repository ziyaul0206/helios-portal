import { Card } from "@/components/card"
import { Icon } from "@/components/icon"
import s from "./list.module.scss"

interface EmptyProps {
  icon?: string
  title: string
}

export const Empty = ({ icon, title }: EmptyProps) => {
  return (
    <Card className={s.empty} auto>
      {icon && <Icon icon={icon} className={s.sad} />}
      <p>{title}</p>
    </Card>
  )
}
