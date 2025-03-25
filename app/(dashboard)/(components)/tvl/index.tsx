import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Symbol } from "@/components/symbol"
import { generateRandomTvl } from "@/lib/faker"
import {
  formatBigNumber,
  formatCurrency,
  formatNumber
} from "@/lib/utils/number"
import s from "./tvl.module.scss"
import { useAssetsInfo } from "@/hooks/useAssetsInfo"

export const TVL = () => {
  const { assets, holders, totalTVL } = useAssetsInfo()
  console.log(assets)

  const tvl = generateRandomTvl()
  const sortedTvl = [...tvl].sort((a, b) => b.amountLocked - a.amountLocked)

  return (
    <Card className={s.tvl}>
      <Heading
        icon="hugeicons:locked"
        title="Total Value Locked"
        className={s.heading}
        rightClassName={s.headingRight}
      >
        <div className={s.right}>
          <div className={s.total}>{formatCurrency(totalTVL)}</div>
          <div className={s.holder}>{formatNumber(holders)} Holders</div>
        </div>
      </Heading>
      <div className={s.list}>
        {assets.map((token) => (
          <div className={s.item} key={token.id}>
            <div className={s.bar}>
              <div
                style={
                  {
                    "--color": token.color,
                    height: `${(token.tvlUSD / totalTVL) * 100}%`
                  } as React.CSSProperties
                }
              >
                <div className={s.hover}>
                  <strong>{token.name}</strong>
                  <span>{formatCurrency(token.tvlUSD)}</span>
                </div>
              </div>
            </div>
            <Symbol
              icon={token.symbolIcon}
              color={token.color}
              className={s.symbol}
            />
            <div className={s.name}>{token.symbol}</div>
            <div className={s.price}>${formatBigNumber(token.tvlUSD)}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
