import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Area, Grid } from "@/components/grid"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { formatBigNumber } from "@/lib/utils/number"
import { StatItem } from "../../../(components)/item/stat"
import s from "./top.module.scss"
import { useParams } from "next/navigation"
import { useValidatorDetail } from "@/hooks/useValidatorDetail"
import { useChainId, useSwitchChain } from "wagmi"
import { HELIOS_NETWORK_ID } from "@/config/app"
import { useState } from "react"
import { ModalStake } from "@/app/delegations/(components)/active/stake"
import { Message } from "@/components/message"

export const Top = () => {
  const params = useParams()
  const validatorId = params.id as string
  const { validator, delegation } = useValidatorDetail(validatorId)
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [openStake, setOpenStake] = useState(false)

  if (!validator) return <></>

  // const socials = [
  //   {
  //     icon: "hugeicons:globe-02",
  //     url: "http://helioschain.network/"
  //   },
  //   {
  //     icon: "hugeicons:mail-02",
  //     url: "mailto:contact@helioschain.network"
  //   },
  //   {
  //     icon: "hugeicons:new-twitter",
  //     url: "https://x.com/heliosguardian"
  //   },
  //   {
  //     icon: "hugeicons:telegram",
  //     url: "https://t.me/heliosguardian"
  //   }
  // ]

  const isActive = validator.status === 3
  const enableDelegation = validator.delegationAuthorization
  const formattedApr = parseFloat(validator.apr).toFixed(2) + "%"
  const formattedCommission =
    parseFloat(validator.commission.commission_rates.rate) * 100 + "%"
  const tokens = delegation.assets

  const totalDelegated = tokens.reduce(
    (acc, token) => acc + token.balance.totalPrice,
    0
  )

  const ratioOptimal =
    (tokens.find((token) => token.display.symbol === "hls")?.price.usd || 0) >=
    totalDelegated

  const handleOpenStake = () => {
    if (chainId !== HELIOS_NETWORK_ID) {
      switchChain({ chainId: HELIOS_NETWORK_ID })
    }

    setOpenStake(true)
  }

  return (
    <Grid className={s.top}>
      <Area area="a">
        <Card className={s.infos}>
          <Heading
            title={validator.moniker}
            // verified
            description={
              <>
                <div className={s.bottom}>
                  {isActive && <Badge status="success">Active</Badge>}
                  {/* <time>Join April 10, 2025</time> */}
                </div>
              </>
            }
          >
            <Button
              icon="hugeicons:download-03"
              onClick={() => handleOpenStake()}
              disabled={!enableDelegation}
            >
              Stake now
            </Button>
            <ModalStake
              title={`Stake on ${validator.moniker}`}
              validatorAddress={validator.validatorAddress}
              open={openStake}
              setOpen={setOpenStake}
            />
          </Heading>
          {enableDelegation ? (
            <Message title="Delegation enabled" variant="success">
              This validator is actively accepting delegations. You can safely
              stake your tokens.
            </Message>
          ) : (
            <Message title="Delegation disabled" variant="warning">
              This validator is not accepting new delegations at the moment.
              Please choose another validator to stake your tokens.
            </Message>
          )}
          {/* <div className={s.description}>
            <p>
              Helios Guardian is a professional validator service with 99.98%
              uptime and a strong focus on security and reliability. We operate
              enterprise-grade infrastructure with multiple redundancies and
              24/7 monitoring.
            </p>
          </div> */}
          {/* <div className={s.plus}>
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
          </div> */}
        </Card>
      </Area>
      <Area area="b">
        <Card className={s.stats}>
          <StatItem
            className={s.stat}
            label="APY"
            value={formattedApr}
            color="apy"
            icon="hugeicons:shield-energy"
            // bottom="Base: 100% + Boost: 1154.55%"
          />
          {/* <StatItem
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
          /> */}
          <StatItem
            className={s.stat}
            label="Commission"
            value={formattedCommission}
            color="commission"
            icon="hugeicons:clock-01"
            // bottom="Of staking rewards"
          />
          <div
            className={s.message}
            data-color={ratioOptimal ? "success" : "primary"}
          >
            <Icon icon="hugeicons:checkmark-circle-03" />
            {ratioOptimal ? "Optimal Helios Ratio" : "Good Helios Ratio"}
          </div>
          <div className={s.total}>
            <span>Total Delegated</span>
            <strong>${formatBigNumber(totalDelegated)}</strong>
          </div>
        </Card>
      </Area>
    </Grid>
  )
}
