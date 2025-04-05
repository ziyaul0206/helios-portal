import { Card } from "@/components/card"
import { Icon } from "@/components/icon"
import { Stat } from "./stat"
import s from "./stats.module.scss"

export const Stats = () => {
  return (
    <Card className={s.stats} auto>
      <Stat
        title="Active Validators"
        icon="hugeicons:checkmark-square-01"
        bottom={<div>test</div>}
      >
        <strong>80</strong>
        <span>/100</span>
      </Stat>
      <Stat
        title="Average APY"
        icon="hugeicons:percent-square"
        bottom={<p data-color="success">+0.3% from last epoch</p>}
      >
        <strong>12.4</strong>
        <span>%</span>
      </Stat>
      <Stat
        title="Total Staked Value"
        icon="hugeicons:stake"
        bottom={<p data-color="primary">23% of circulating supply</p>}
      >
        <span>$</span>
        <strong>120.5M</strong>
      </Stat>
      <Stat
        title="Network Security"
        icon="hugeicons:security-lock"
        bottom={
          <p data-color="success">
            <Icon icon="hugeicons:security-check" />
            Optimally distributed
          </p>
        }
      >
        <strong>Very High</strong>
      </Stat>
    </Card>
  )
}
