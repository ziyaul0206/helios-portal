"use client"

import { usePathname, useRouter } from "next/navigation"
import styles from "./tabs.module.scss"

const tabs = [
  { label: "Proposals", href: "/governance/proposals" },
  { label: "Voters", href: "/governance/voters" },
  { label: "Info", href: "/governance/info" }
]

const TabSelector = () => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={styles.tabWrapper}>
      <div className={styles.tabSelector}>
        {tabs.map((tab) => (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`${styles.tabButton} ${
              pathname === tab.href ? styles.active : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TabSelector
