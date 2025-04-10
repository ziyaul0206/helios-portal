import { Area, Grid } from "@/components/grid"
import s from "./page.module.scss"
import { Top } from "./top"

export default function Page() {
  return (
    <>
      <Grid className={s.top}>
        <Area area="a">
          <Top />
        </Area>
        <Area area="b">-</Area>
      </Grid>
    </>
  )
}
