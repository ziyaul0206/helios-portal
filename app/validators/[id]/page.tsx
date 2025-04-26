"use client"

import { Area, Grid } from "@/components/grid"
import { Apy } from "./(components)/apy"
// import { Delegator } from "./(components)/delegator"
// import { Governance } from "./(components)/governance"
// import { Performance } from "./(components)/performance"
import { Staking } from "./(components)/staking"
import { Top } from "./(components)/top"
import s from "./page.module.scss"
import { useValidatorDetail } from "@/hooks/useValidatorDetail"
import { useParams, useRouter } from "next/navigation"
import { Alert } from "@/app/(components)/alert"

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const validatorId = params.id as string
  const { validator, isLoading } = useValidatorDetail(validatorId)

  if (!isLoading && !validator) {
    router.push("/validators")
    return <Alert type="danger">Error retrieving validator details...</Alert>
  }

  if (isLoading) {
    return <Alert type="primary">Loading validator details...</Alert>
  }

  return (
    <>
      <Top />
      <Grid className={s.content}>
        <Area area="a">
          <Apy />
          {/* <Governance /> */}
        </Area>
        <Area area="b">
          {/* <Performance /> */}
          {/* <Delegator /> */}
          <Staking />
        </Area>
      </Grid>
    </>
  )
}
