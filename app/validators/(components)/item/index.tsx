import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import { formatBigNumber } from "@/lib/utils/number"
import { Validator } from "@/types/validator"
import s from "./item.module.scss"
import { StatItem } from "./stat"
import { useValidatorDetail } from "@/hooks/useValidatorDetail"
import { useState } from "react"
import { ModalStake } from "@/app/delegations/(components)/active/stake"
import { useChainId, useSwitchChain } from "wagmi"
import { HELIOS_NETWORK_ID } from "@/config/app"

export const Item = ({
  moniker,
  validatorAddress,
  // description,
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
  const [openStake, setOpenStake] = useState(false)
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { delegation } = useValidatorDetail(validatorAddress)

  const isActive = status === 3
  const formattedApr = parseFloat(apr).toFixed(2) + "%"
  const formattedCommission =
    parseFloat(commission.commission_rates.rate) * 100 + "%"

  // const tokens = [
  //   {
  //     ...getToken("usdt"),
  //     amount: 1000000
  //   },
  //   {
  //     ...getToken("hls"),
  //     amount: 1000000
  //   },
  //   {
  //     ...getToken("eth"),
  //     amount: 300000
  //   },
  //   {
  //     ...getToken("bnb"),
  //     amount: 200000
  //   }
  // ]

  const tokens = delegation.assets

  const totalDelegated = tokens.reduce(
    (acc, token) => acc + token.balance.totalPrice,
    0
  )

  const ratioOptimal =
    (tokens.find((token) => token.display.symbol === "hls")?.balance
      .totalPrice || 0) >= totalDelegated

  const handleOpenStake = () => {
    if (chainId !== HELIOS_NETWORK_ID) {
      switchChain({ chainId: HELIOS_NETWORK_ID })
    }

    setOpenStake(true)
  }

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
      {tokens.length > 0 && (
        <>
          <div className={s.total}>
            <span>Total Delegated</span>
            <strong>${formatBigNumber(totalDelegated)}</strong>
          </div>
          <div className={s.bars}>
            {tokens.map((token) => (
              <div
                className={s.bar}
                key={"validators-" + token.functionnal.address}
                style={
                  {
                    "--width": `${
                      (token.balance.totalPrice / totalDelegated) * 100
                    }%`,
                    "--color": token.display.color
                  } as React.CSSProperties
                }
              >
                <div className={s.popover}>
                  <span>{token.display.symbol.toUpperCase()}</span>
                  <strong>${formatBigNumber(token.balance.totalPrice)}</strong>
                </div>
              </div>
            ))}
          </div>
          <div
            className={s.message}
            data-color={ratioOptimal ? "success" : "primary"}
          >
            <Icon icon="hugeicons:checkmark-circle-03" />
            {ratioOptimal ? "Optimal Helios Ratio" : "Good Helios Ratio"}
          </div>
        </>
      )}

      <div className={s.buttons}>
        <Button className={s.stake} border onClick={handleOpenStake}>
          Stake Now
        </Button>
        <ModalStake
          title={`Stake on ${moniker}`}
          validatorAddress={validatorAddress}
          open={openStake}
          setOpen={setOpenStake}
        />
        <Button
          href={"/validators/" + validatorAddress}
          variant="secondary"
          border
          icon="hugeicons:link-square-02"
        />
      </div>
    </div>
  )
}
