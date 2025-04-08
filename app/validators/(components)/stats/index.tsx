"use client"

import { Card } from "@/components/card"
import { Stat } from "./stat"
import s from "./stats.module.scss"
import { useValidatorInfo } from "@/hooks/useValidatorInfo"
import { useAssetsInfo } from "@/hooks/useAssetsInfo"

export const Stats = () => {
  const { activeValidators, maxValidators, avgApr, networkSecurity } =
    useValidatorInfo()
  const { totalTVL } = useAssetsInfo()

  return (
    <Card className={s.stats} auto>
      <Stat
        title="Active Validators"
        icon="hugeicons:checkmark-square-01"
        bottom={<></>}
      >
        <strong>{activeValidators}</strong>
        <span>/{maxValidators}</span>
      </Stat>
      <Stat title="Average APY" icon="hugeicons:percent-square" bottom={<></>}>
        <strong>{avgApr.toFixed(2)}</strong>
        <span>%</span>
      </Stat>
      <Stat title="Total Staked Value" icon="hugeicons:stake" bottom={<></>}>
        <span>$</span>
        <strong>{totalTVL}</strong>
      </Stat>
      <Stat
        title="Network Security"
        icon="hugeicons:security-lock"
        bottom={<></>}
      >
        <strong>{networkSecurity}</strong>
      </Stat>
    </Card>
  )
}
