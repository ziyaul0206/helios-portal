import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { RechartsPie, RechartsPieLegend } from "@/components/recharts/pie"
import { TOKEN_COLORS } from "@/config/constants"
import s from "./distribution.module.scss"

export const Distribution = () => {
  const data = [
    {
      name: "Helios Guardian",
      value: 6500,
      percentage: 72.2,
      color: TOKEN_COLORS.hls
    },
    {
      name: "Cosmic Validators",
      value: 2500,
      percentage: 27.8,
      color: "#8B5CF6"
    }
  ]

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
