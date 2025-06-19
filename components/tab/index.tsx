"use client"

import { usePathname, useRouter } from "next/navigation"
import styles from "./tabs.module.scss"
import { FaRegListAlt, FaUsers, FaHandHoldingHeart } from "react-icons/fa"

const tabs = [
  { label: "Proposals", href: "/governance/proposals", icon: <FaRegListAlt /> },
  { label: "Voters", href: "/governance/voters", icon: <FaUsers /> },
  {
    label: "Delegations",
    href: "/governance/delegations",
    icon: <FaHandHoldingHeart />
  }
]

const TabSelector = () => {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={styles.sidebar}>
      {tabs.map((tab) => (
        <button
          key={tab.href}
          onClick={() => router.push(tab.href)}
          className={`${styles.tabButton} ${
            pathname === tab.href ? styles.active : ""
          }`}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default TabSelector
