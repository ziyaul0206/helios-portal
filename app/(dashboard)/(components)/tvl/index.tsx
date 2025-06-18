import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Symbol } from "@/components/symbol"
import {
  formatBigNumber,
  formatCurrency,
  formatNumber
} from "@/lib/utils/number"
import s from "./tvl.module.scss"
import { useAssetsInfo } from "@/hooks/useAssetsInfo"
import Image from "next/image"
import { HELIOS_TOKEN_ADDRESS } from "@/config/app"

export const TVL = () => {
  const { assets, totalHolders, totalTVL } = useAssetsInfo()
  const filteredAssets = assets.filter(
    (asset) =>
      asset.totalShares !== "0" &&
      asset.contractAddress !== HELIOS_TOKEN_ADDRESS
  )

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
          <div className={s.holder}>
            {formatBigNumber(totalHolders, 0)} Holders
          </div>
        </div>
      </Heading>
      <div className={s.list}>
        {filteredAssets.map((token) => (
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
            {token.enriched.display.logo !== "" && (
              <Image
                src={token.enriched.display.logo}
                alt={token.enriched.display.name}
                width={24}
                height={24}
                className={s.symbol}
              />
            )}
            {token.enriched.display.logo === "" && (
              <Symbol
                icon={token.enriched.display.symbolIcon}
                color={token.enriched.display.color}
                className={s.symbol}
              />
            )}

            <div className={s.name}>
              {token.enriched.display.symbol.toUpperCase()}
            </div>
            <div className={s.price}>
              {formatNumber(parseFloat(token.tokenAmount))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
