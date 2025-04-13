import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Symbol } from "@/components/symbol"
import { TOKENS } from "@/config/tokens"
import { formatNumber } from "@/lib/utils/number"
import s from "./staking.module.scss"

export const Staking = () => {
  const details = [
    {
      label: "Minimum Stake",
      value: "1 HLS / 0.01 ETH / 0.05 BNB"
    },
    {
      label: "Unbonding Period",
      value: "14 days"
    },
    {
      label: "Reward Distribution",
      value: "Daily at 00:00 UTC"
    },
    {
      label: "Commission Rate",
      value: "5%"
    },
    {
      label: "Commission Change",
      value: "7-day notice required"
    }
  ]

  const assets = [
    {
      ...TOKENS.get("hls"),
      amount: 1000000
    },
    {
      ...TOKENS.get("eth"),
      amount: 5
    },
    {
      ...TOKENS.get("bnb"),
      amount: 10
    },
    {
      ...TOKENS.get("usdt"),
      amount: 500
    }
  ]

  return (
    <Card auto>
      <Heading
        icon="hugeicons:information-circle"
        title="Staking Information"
      />
      <div className={s.block}>
        <h3>Staking Details</h3>
        <ul className={s.details}>
          {details.map((detail, index) => (
            <li key={index}>
              <span className={s.label}>{detail.label}</span>
              <span className={s.value}>{detail.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.block}>
        <h3>Supported Assets</h3>
        <ul className={s.assets}>
          {assets.map((asset, index) => (
            <li key={index}>
              <div className={s.token}>
                <Symbol
                  icon={asset.symbolIcon as string}
                  color={asset.color}
                  className={s.icon}
                />
                <div className={s.name}>
                  {asset.name} <small>{asset.symbol}</small>
                </div>
              </div>
              <div className={s.amount}>
                {formatNumber(asset.amount, 2)} <small>Available</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
