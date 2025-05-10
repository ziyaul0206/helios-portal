import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Symbol } from "@/components/symbol"
import { formatCurrency, formatNumber } from "@/lib/utils/number"
import s from "./tvl.module.scss"
import { useAssetsInfo } from "@/hooks/useAssetsInfo"

export const TVL = () => {
  const { assets, holders, totalTVL } = useAssetsInfo()

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
          <div className={s.item} key={`tvl-${token.contractAddress}`}>
            <div className={s.bar}>
              <div
                style={
                  {
                    "--color": token.enriched.display.color,
                    height: `${(token.tvlUSD / totalTVL) * 100}%`
                  } as React.CSSProperties
                }
              >
                <div className={s.hover}>
                  <strong>{token.enriched.display.name}</strong>
                  {token.tvlUSD !== 0 && (
                    <span>{formatCurrency(token.tvlUSD)}</span>
                  )}
                </div>
              </div>
            </div>
            <Symbol
              icon={token.enriched.display.symbolIcon}
              color={token.enriched.display.color}
              className={s.symbol}
            />
            <div className={s.name}>
              {token.enriched.display.symbol.toUpperCase()}
            </div>
            <div className={s.price}>{token.tokenAmount}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
