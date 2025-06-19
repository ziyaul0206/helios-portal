"use client"

import TabSelector from "@/components/tab"
import { ReactNode } from "react"
import styles from "./layout.module.scss"

export default function GovernanceLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <div className={styles.layoutWrapper}>
      <TabSelector />
      <div className={styles.pageContent}>{children}</div>
    </div>
  )
}
