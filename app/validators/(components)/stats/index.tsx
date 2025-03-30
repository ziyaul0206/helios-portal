import { Card } from "@/components/card"
import { Icon } from "@/components/icon"
import s from "./stats.module.scss"

interface BlockProps {
  title: string
  icon: string
  children: React.ReactNode
  bottom: React.ReactNode
}

const Block = ({ title, icon, children, bottom }: BlockProps) => {
  return (
    <div className={s.block}>
      <Icon icon={icon} />
      <h2>{title}</h2>
      <div className={s.content}>{children}</div>
      {bottom}
    </div>
  )
}

export const Stats = () => {
  return (
    <Card>
      <Block
        title="Active Validators"
        icon="hugeicons:checkmark-square-01"
        bottom={<div>test</div>}
      >
        <strong>80</strong>
        <span>/100</span>
      </Block>
      <Block
        title="Average APY"
        icon="hugeicons:percent-square"
        bottom={<p>+0.3% from last epoch</p>}
      >
        <strong>12.4</strong>
        <span>%</span>
      </Block>
      <Block
        title="Total Staked Value"
        icon="hugeicons:stake"
        bottom={<p>23% of circulating supply</p>}
      >
        <span>$</span>
        <strong>120.5M</strong>
      </Block>
      <Block
        title="Network Security"
        icon="hugeicons:security-lock"
        bottom={<p>Optimally distributed</p>}
      >
        <strong>Very High</strong>
      </Block>
    </Card>
  )
}
