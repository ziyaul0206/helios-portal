"use client"

import { Button } from "@/components/button"
import { Icon } from "@/components/icon"
import { Symbol } from "@/components/symbol"
import { TableCell, TableRow } from "@/components/table"
import { ValidatorRow } from "@/types/faker"
import { useState } from "react"
import { ModalClaim } from "../claim/modal"
import s from "./active.module.scss"
import { ModalStake } from "./stake"
import { ModalUnstake } from "./unstake"

export const Row = ({
  name,
  commission,
  assets,
  rewards,
  apy,
  base
}: ValidatorRow) => {
  const [openRewards, setOpenRewards] = useState(false)
  const [openStake, setOpenStake] = useState(false)
  const [openUnstake, setOpenUnstake] = useState(false)
  const [rewardsAmount, setRewardsAmount] = useState(rewards)

  return (
    <TableRow className={s.row}>
      <TableCell className={s.first}>
        <div className={s.illu}></div>
      </TableCell>
      <TableCell>
        <strong>{name}</strong>
        <small>Commission: {commission}%</small>
      </TableCell>
      <TableCell>
        <ul className={s.assets}>
          {assets.map((asset, index) => (
            <li key={index}>
              <div className={s.name}>
                <Symbol icon={asset.symbolIcon} color={asset.color} />
                {asset.name}
              </div>
              <div className={s.amount}>{asset.amount}</div>
            </li>
          ))}
        </ul>
      </TableCell>
      <TableCell className={s.apy}>
        <strong>{apy}%</strong>
        <small>{base}%</small>
      </TableCell>
      <TableCell>
        <strong className={s.rewards}>
          {rewardsAmount} <Icon icon="helios" />
        </strong>
        <small>${rewardsAmount * 100}</small>
      </TableCell>
      <TableCell>
        <time className={s.last}>
          <Icon icon="hugeicons:clock-02" /> 2 hours ago
        </time>
      </TableCell>
      <TableCell align="right">
        <div className={s.actions}>
          <Button
            icon="helios"
            variant="success"
            size="xsmall"
            border
            onClick={() => setOpenRewards(true)}
          />
          <ModalClaim
            title={`Claim ${name} Rewards`}
            open={openRewards}
            setOpen={setOpenRewards}
            rewards={rewardsAmount}
            setRewards={setRewardsAmount}
          />
          <Button
            icon="hugeicons:add-circle"
            variant="primary"
            size="xsmall"
            border
            onClick={() => setOpenStake(true)}
          />
          <ModalStake
            title={`Stake ${name}`}
            open={openStake}
            setOpen={setOpenStake}
          />
          <Button
            icon="hugeicons:minus-sign-circle"
            variant="warning"
            size="xsmall"
            border
            onClick={() => setOpenUnstake(true)}
          />
          <ModalUnstake
            title={`Unstake ${name}`}
            open={openUnstake}
            setOpen={setOpenUnstake}
          />
          <Button
            href="/validators/details"
            icon="hugeicons:link-circle-02"
            variant="secondary"
            size="xsmall"
            border
          />
        </div>
      </TableCell>
    </TableRow>
  )
}
