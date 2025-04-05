import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import { ValidatorProps } from "@/types/faker"
import clsx from "clsx"
import { useState } from "react"
import { toast } from "sonner"
import s from "./item.module.scss"

interface StatProps {
  label: string
  value: string
  className: string
  icon: string
}

const Stat = ({ label, value, className, icon }: StatProps) => {
  return (
    <div className={clsx(s.stat, className)}>
      <Icon icon={icon} className={s.icon} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export const Item = ({
  name,
  description,
  image,
  apyBoost,
  reputation,
  uptime,
  commission
}: ValidatorProps) => {
  const [favorite, setFavorite] = useState(false)

  const handleFavorite = () => {
    setFavorite(!favorite)
    if (favorite) {
      toast.success(`Validator "${name}" added to favorites.`)
    } else {
      toast.success(`Validator "${name}" removed from favorites.`)
    }
  }

  return (
    <div className={s.item}>
      <Button
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
      />
      <div className={s.top}>
        <div className={s.image}></div>
        <div className={s.heading}>
          <Badge status="success">Active</Badge>
          <h3>{name}</h3>
        </div>
      </div>
      <div className={s.stats}>
        <Stat
          label="APY"
          value={`${apyBoost}x`}
          className={s.apy}
          icon="hugeicons:shield-energy"
        />
        <Stat
          label="Reputation"
          value={`${reputation}/100`}
          className={s.reputation}
          icon="hugeicons:percent-circle"
        />
        <Stat
          label="Uptime"
          value={`${uptime}%`}
          className={s.uptime}
          icon="hugeicons:award-04"
        />
        <Stat
          label="Commission"
          value={`${commission}%`}
          className={s.commission}
          icon="hugeicons:clock-01"
        />
      </div>
      <div className={s.buttons}>
        <Button className={s.stake} border>
          Stake Now
        </Button>
        <Button variant="secondary" border icon="hugeicons:link-square-02" />
      </div>
    </div>
  )
}
