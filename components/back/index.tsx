"use client"
import { useRouter } from "next/navigation"

import { Icon } from "../icon"
import styles from "./back.module.scss"

const BackSection = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className={styles.container}>
      <div className={styles.icon} onClick={handleBack}>
        <Icon icon="material-symbols:arrow-back" />
      </div>
      <div className={styles.textContainer}>
        <h1 className={styles.headtitle}>Helios Governance</h1>
        <p className={styles.description}>
          Helios governance is a collective of companies, communities, and token
          holders working together to steward the future of the Helios Network.
        </p>
      </div>
    </div>
  )
}

export default BackSection
