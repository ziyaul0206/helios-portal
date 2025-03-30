"use client"

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Dropdown } from "@/components/dropdown"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { Modal } from "@/components/modal"
import { useRef, useState } from "react"
import s from "./list.module.scss"

export const List = () => {
  const [all, setAll] = useState<boolean>(false)
  const [arrange, setArrange] = useState<string>("asc")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [selectedSort, setSelectedSort] = useState("apyBoost")
  const [information, setInformation] = useState(false)

  const sorts = [
    {
      label: "APY Boost",
      value: "apyBoost"
    },
    {
      label: "Total Stake",
      value: "totalStake"
    },
    {
      label: "Commission",
      value: "commission"
    }
  ]

  const handleFocus = () => {
    searchInputRef.current?.focus()
  }

  return (
    <>
      <Card>
        <Heading
          icon="hugeicons:flowchart-01"
          title="Validators"
          description="Stake your assets with trusted validators to earn rewards and secure the Helios network."
        >
          <Button
            icon="hugeicons:information-circle"
            variant="secondary"
            border
            onClick={() => setInformation(true)}
          />
        </Heading>
        <div className={s.search} onClick={handleFocus}>
          <Icon className={s.searchIcon} icon="hugeicons:search-01" />
          <input
            ref={searchInputRef}
            className={s.searchInput}
            type="search"
            placeholder="Search validators..."
          />
          <div className={s.searchActions}>
            <Button
              iconLeft="hugeicons:pin-code"
              variant="secondary"
              onClick={() => setAll(!all)}
            >
              {all ? "All Validators" : "Featured Only"}
            </Button>
            <Button
              iconLeft={
                arrange === "desc"
                  ? "hugeicons:arrange-by-letters-z-a"
                  : "hugeicons:arrange-by-letters-a-z"
              }
              variant="secondary"
              onClick={() => setArrange(arrange === "desc" ? "asc" : "desc")}
            >
              {arrange === "desc" ? "Descending" : "Ascending"}
            </Button>
            <Dropdown
              position="bottom-right"
              opener={
                <Button icon="hugeicons:arrow-down-01" variant="secondary">
                  Sort by:
                  <strong>
                    {sorts.find((s) => s.value === selectedSort)?.label}
                  </strong>
                </Button>
              }
            >
              <ul>
                {sorts.map((sort) => (
                  <li key={sort.value}>
                    <Button
                      key={sort.value}
                      onClick={() => setSelectedSort(sort.value)}
                      variant={
                        selectedSort === sort.value ? "primary" : "secondary"
                      }
                      isActive={selectedSort === sort.value}
                    >
                      {sort.label}
                    </Button>
                  </li>
                ))}
              </ul>
            </Dropdown>
          </div>
        </div>
      </Card>
      <Modal
        title="Helios APY Boost System"
        onClose={() => setInformation(false)}
        open={information}
        className={s.info}
      >
        <p>
          Validators must maintain a balance of HELIOS tokens relative to other
          staked assets to maximize APY. Insufficient HELIOS collateral results
          in reduced rewards for delegators. Look for validators with{" "}
          <strong>Optimal Boost</strong> status for maximum returns.
        </p>
        <Button border onClick={() => setInformation(false)}>
          I understand
        </Button>
      </Modal>
    </>
  )
}
