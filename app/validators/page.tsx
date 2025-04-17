import { Area, Grid } from "@/components/grid"
import { Guide } from "./(components)/guide"
import { List } from "./(components)/list"
import { Stats } from "./(components)/stats"
import s from "./page.module.scss"

export default function Page() {
  return (
    <>
      <Grid className={s.validators}>
        <Area area="a">
          <List />
        </Area>
        <Area area="b" className={s.right}>
          <Stats />
          <Guide />
        </Area>
      </Grid>
    </>
  )
}
