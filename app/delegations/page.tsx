import { History } from "./(components)/history"
import { Projections } from "./(components)/projections"
import { Unbonding } from "./(components)/unbonding"
import s from "./page.module.scss"

export default function Page() {
  return (
    <>
      <div className={s.delegations}>
        <Projections />
        <History />
        <Unbonding />
      </div>
    </>
  )
}
