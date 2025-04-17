import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import { getToken } from "@/config/tokens"
import { formatBigNumber } from "@/lib/utils/number"
import { Validator } from "@/types/validator"
import s from "./item.module.scss"
import { StatItem } from "./stat"

export const Item = ({
  moniker,
  description,
  apr,
  status,
  commission
}: Validator) => {
  // const [favorite, setFavorite] = useState(false)

  // const handleFavorite = () => {
  //   setFavorite(!favorite)
  //   if (favorite) {
  //     toast.success(`Validator "${name}" added to favorites.`)
  //   } else {
  //     toast.success(`Validator "${name}" removed from favorites.`)
  //   }
  // }

  const isActive = status === 3
  const formattedApr = parseFloat(apr).toFixed(2) + "%"
  const formattedCommission =
    parseFloat(commission.commission_rates.rate) * 100 + "%"

  const tokens = [
    {
      ...getToken("usdt"),
      amount: 1000000
    },
    {
      ...getToken("hls"),
      amount: 1000000
    },
    {
      ...getToken("eth"),
      amount: 300000
    },
    {
      ...getToken("bnb"),
      amount: 200000
    }
  ]

  const totalDelegated = tokens.reduce((acc, token) => acc + token.amount, 0)

  return (
    <div className={s.item}>
      {/* <Button
        variant="secondary"
        border
        icon={
          favorite
            ? "material-symbols-light:kid-star"
            : "material-symbols-light:kid-star-outline"
        }
        onClick={handleFavorite}
        className={s.favorite}
        size="xsmall"
      /> */}
      <div className={s.top}>
        <div className={s.image}>
          <Icon icon="hugeicons:flowchart-01" />
        </div>
        <div className={s.heading}>
          {isActive && <Badge status="success">Active</Badge>}
          <h3>{moniker}</h3>
          {/* {description.details && <h4>{description.details}</h4>} */}
        </div>
      </div>
      <div className={s.stats}>
        <StatItem
          label="APY"
          value={formattedApr}
          color="apy"
          icon="hugeicons:shield-energy"
        />
        {/* <StatItem
          label="Reputation"
          value={`${reputation}/100`}
          color="reputation"
          icon="hugeicons:percent-circle"
        />
        <StatItem
          label="Uptime"
          value={`${uptime}%`}
          color="uptime"
          icon="hugeicons:award-04"
        /> */}
        <StatItem
          label="Commission"
          value={formattedCommission}
          color="commission"
          icon="hugeicons:clock-01"
        />
      </div>
      <div className={s.total}>
        <span>Total Delegated</span>
        <strong>${formatBigNumber(totalDelegated)}</strong>
      </div>
      <div className={s.bars}>
        {tokens.map((token) => (
          <div
            className={s.bar}
            key={token.symbol}
            style={
              {
                "--width": `${(token.amount / totalDelegated) * 100}%`,
                "--color": token.color
              } as React.CSSProperties
            }
          >
            <div className={s.popover}>
              <span>{token.symbol}</span>
              <strong>${formatBigNumber(token.amount)}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className={s.message} data-color="success">
        <Icon icon="hugeicons:checkmark-circle-03" />
        Optimal Helios Ratio
      </div>
      <div className={s.buttons}>
        <Button className={s.stake} border>
          Stake Now
        </Button>
        <Button
          href="/validators/details"
          variant="secondary"
          border
          icon="hugeicons:link-square-02"
        />
      </div>
    </div>
  )
}
