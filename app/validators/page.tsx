import { Area, Grid } from "@/components/grid"
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
        <Area area="b">
          <Stats />
        </Area>
      </Grid>
    </>
  )
}
