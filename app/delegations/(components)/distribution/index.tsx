import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { RechartsPie, RechartsPieLegend } from "@/components/recharts/pie"
import { TOKEN_COLORS } from "@/config/constants"
import s from "./distribution.module.scss"
import { useDelegationInfo } from "@/hooks/useDelegationInfo"

const tokenColorKeys = Object.keys(TOKEN_COLORS)
const getValidatorColorByIndex = (index: number) => {
  const key = tokenColorKeys[index % tokenColorKeys.length]
  return TOKEN_COLORS[key as keyof typeof TOKEN_COLORS]
}

export const Distribution = () => {
  const { delegationsByValidator, totalDelegatedUSD } = useDelegationInfo()

  const data = delegationsByValidator.map((validator, i) => ({
    name: validator.moniker,
    value: validator.totalUSD,
    percentage: (validator.totalUSD / totalDelegatedUSD) * 100,
    color: getValidatorColorByIndex(i)
  }))

  return (
    <Card className={s.distribution} auto>
      <Heading icon="hugeicons:chart-ring" title="Delegation Distribution" />
      <div className={s.chart}>
        <h3>Delegation Distribution</h3>
        <RechartsPie data={data} className={s.pie} />
        <RechartsPieLegend data={data} className={s.legend} />
      </div>
    </Card>
  )
}
