import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Area, Grid } from "@/components/grid"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { formatBigNumber } from "@/lib/utils/number"
import { StatItem } from "../../../(components)/item/stat"
import s from "./top.module.scss"

export const Top = () => {
  const socials = [
    {
      icon: "hugeicons:globe-02",
      url: "http://helioschain.network/"
    },
    {
      icon: "hugeicons:mail-02",
      url: "mailto:contact@helioschain.network"
    },
    {
      icon: "hugeicons:new-twitter",
      url: "https://x.com/heliosguardian"
    },
    {
      icon: "hugeicons:telegram",
      url: "https://t.me/heliosguardian"
    }
  ]

  return (
    <Grid className={s.top}>
      <Area area="a">
        <Card className={s.infos}>
          <Heading
            title="Helios Guardian"
            verified
            description={
              <>
                <div className={s.bottom}>
                  <Badge status="success">Active</Badge>
                  <time>Join April 10, 2025</time>
                </div>
              </>
            }
          >
            <Button icon="hugeicons:download-03" />
            <Button icon="hugeicons:copy-01" variant="secondary" border />
            <Button
              icon="material-symbols-light:kid-star-outline"
              variant="secondary"
              border
            />
          </Heading>
          <div className={s.description}>
            <p>
              Helios Guardian is a professional validator service with 99.98%
              uptime and a strong focus on security and reliability. We operate
              enterprise-grade infrastructure with multiple redundancies and
              24/7 monitoring.
            </p>
          </div>
          <div className={s.plus}>
            <ul className={s.socials}>
              {socials.map(({ url, icon }, index) => (
                <li key={index}>
                  <Button
                    href={url}
                    icon={icon}
                    size="xsmall"
                    variant="secondary"
                    border
                  />
                </li>
              ))}
            </ul>
            <p>Located in Frankfurt, Germany</p>
          </div>
        </Card>
      </Area>
      <Area area="b">
        <Card className={s.stats}>
          <StatItem
            className={s.stat}
            label="APY"
            value="1254.55%"
            color="apy"
            icon="hugeicons:shield-energy"
            bottom="Base: 100% + Boost: 1154.55%"
          />
          <StatItem
            className={s.stat}
            label="Reputation"
            value="98/100"
            color="reputation"
            icon="hugeicons:percent-circle"
            bottom="Based on historical performance"
          />
          <StatItem
            className={s.stat}
            label="Uptime"
            value="98.9%"
            color="uptime"
            icon="hugeicons:award-04"
            bottom="Last 30 days"
          />
          <StatItem
            className={s.stat}
            label="Commission"
            value="5%"
            color="commission"
            icon="hugeicons:clock-01"
            bottom="Of staking rewards"
          />
          <div className={s.message} data-color="success">
            <Icon icon="hugeicons:checkmark-circle-03" />
            Optimal Helios Ratio
          </div>
          <div className={s.total}>
            <span>Total Delegated</span>
            <strong>${formatBigNumber(2500000)}</strong>
          </div>
        </Card>
      </Area>
    </Grid>
  )
}
