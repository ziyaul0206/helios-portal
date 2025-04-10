import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import s from "./top.module.scss"

export const Top = () => {
  return (
    <Card className={s.top}>
      <Heading title="Validator Details" />
    </Card>
  )
}
