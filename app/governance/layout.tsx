"use client"

import TabSelector from "@/components/tab"
import { ReactNode } from "react"

export default function GovernanceLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <div className="p-6">
      <TabSelector />
      <div className="mt-6">{children}</div>
    </div>
  )
}
