"use client"

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Dropdown } from "@/components/dropdown"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { generateRandomValidators } from "@/lib/faker"
import { useRef, useState } from "react"
import { Item } from "../item"
import { Informations } from "./informations"
import s from "./list.module.scss"

export const List = () => {
  const [all, setAll] = useState<boolean>(false)
  const [arrange, setArrange] = useState<string>("asc")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [selectedSort, setSelectedSort] = useState("apyBoost")
  const validators = generateRandomValidators(20)

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
      <Card auto>
        <Heading
          icon="hugeicons:flowchart-01"
          title="Validators"
          description="Stake your assets with trusted validators to earn rewards and secure the Helios network."
        >
          <Informations />
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
              <span>{all ? "All Validators" : "Featured Only"}</span>
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
              <span>{arrange === "desc" ? "Descending" : "Ascending"}</span>
            </Button>
            <Dropdown
              position="bottom-right"
              opener={
                <Button
                  iconLeft="hugeicons:filter"
                  icon="hugeicons:arrow-down-01"
                  variant="secondary"
                >
                  <span>
                    Sort by:
                    <strong>
                      {sorts.find((s) => s.value === selectedSort)?.label}
                    </strong>
                  </span>
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
                      data-dropdown-close
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
      <div className={s.list}>
        {validators.map((validator) => (
          <Item key={validator.name} {...validator} />
        ))}
      </div>
    </>
  )
}
