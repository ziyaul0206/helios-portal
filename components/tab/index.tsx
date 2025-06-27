"use client"

import { usePathname, useRouter } from "next/navigation"
import styles from "./tabs.module.scss"
import {
  FaRegListAlt,
  FaUsers,
  FaHandHoldingHeart,
  FaArrowLeft
} from "react-icons/fa"

const tabs = [
  { label: "Proposals", href: "/governance/proposals", icon: <FaRegListAlt /> },
  { label: "Voters", href: "/governance/voters", icon: <FaUsers /> },
  {
    label: "Power",
    href: "/governance/power",
    icon: <FaHandHoldingHeart />
  }
]

const TabSelector = () => {
  const pathname = usePathname()
  const router = useRouter()

  // Check if we're on a detail page (has additional path segments)
  const isDetailPage = pathname.split("/").length >= 3

  // Get the parent tab path for the current detail page
  const getParentTabPath = () => {
    const pathSegments = pathname.split("/")
    if (pathSegments.length >= 3) {
      // Return path like "/governance/proposals" from "/governance/proposals/123"
      return `/${pathSegments[1]}`
    }
    return pathname
  }

  const parentPath = getParentTabPath()

  return (
    <div
      className={`${styles.tabContainer} ${
        isDetailPage ? styles.withBackButton : styles.withoutBackButton
      }`}
    >
      {/* Back button on the left side */}
      {isDetailPage && (
        <div className={styles.backButtonContainer}>
          <button
            onClick={() => router.push(parentPath)}
            className={styles.backButton}
          >
            <span className={styles.icon}>
              <FaArrowLeft />
            </span>
            <span className={styles.label}>Back</span>
          </button>
        </div>
      )}

      {/* Regular tab buttons */}
      <div className={styles.sidebar}>
        {tabs.map((tab) => (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`${styles.tabButton} ${
              (isDetailPage ? parentPath === tab.href : pathname === tab.href)
                ? styles.active
                : ""
            }`}
          >
            <span className={styles.icon}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TabSelector
