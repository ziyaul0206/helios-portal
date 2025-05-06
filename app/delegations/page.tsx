"use client"

import { Active } from "./(components)/active"
import { Distribution } from "./(components)/distribution"
// import { History } from "./(components)/history"
// import { Projections } from "./(components)/projections"
import { Top } from "./(components)/top"
import { Transactions } from "./(components)/transactions"
// import { Unbonding } from "./(components)/unbonding"
import s from "./page.module.scss"

export default function Page() {
  return (
    <>
      <div className={s.delegations}>
        <Top />
        <div className={s.middle}>
          <Distribution />
          {/* <History /> */}
        </div>
        <Active />
        {/* <Unbonding /> */}
        {/* <Projections /> */}
        <Transactions />
      </div>
    </>
  )
}
