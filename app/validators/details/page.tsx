import { Area, Grid } from "@/components/grid"
import { Apy } from "./(components)/apy"
import { Delegator } from "./(components)/delegator"
import { Governance } from "./(components)/governance"
import { Performance } from "./(components)/performance"
import { Staking } from "./(components)/staking"
import { Top } from "./(components)/top"
import s from "./page.module.scss"

export default function Page() {
  return (
    <>
      <Top />
      <Grid className={s.content}>
        <Area area="a">
          <Apy />
          <Governance />
        </Area>
        <Area area="b">
          <Performance />
          <Delegator />
          <Staking />
        </Area>
      </Grid>
    </>
  )
}
