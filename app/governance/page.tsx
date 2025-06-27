import { Guide } from "./(components)/guide"
import { History } from "./(components)/history"
import { List } from "./(components)/list"
import { Power } from "./(components)/power"
import { Proposal } from "./(components)/proposal"
import { Statistics } from "./(components)/statistics"
import s from "./page.module.scss"

export default function Page() {
  return (
    <>
      <div className={s.governance}>
        <div className={s.left}>
          {/* <Power /> */}
          {/* <List /> */}
          <History />
          <Guide />
        </div>
        <div className={s.right}>
          <Proposal />
          <Statistics />
        </div>
      </div>
    </>
  )
}
