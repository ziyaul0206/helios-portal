import { History } from "./(components)/history"
import { Projections } from "./(components)/projections"
import s from "./page.module.scss"

export default function Page() {
  return (
    <>
      <div className={s.delegations}>
        <Projections />
        <History />
      </div>
    </>
  )
}
