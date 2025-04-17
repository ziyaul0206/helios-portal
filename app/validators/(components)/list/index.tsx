"use client"

import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Icon } from "@/components/icon"
import { useState } from "react"
import { Item } from "../item"
import { Informations } from "./informations"
import s from "./list.module.scss"
import { useValidators } from "@/hooks/useValidators"

export const List = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const { validators, isLoading: validatorsIsLoading } = useValidators()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredValidators = validators.filter((validator) =>
    validator.moniker.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <div className={s.search}>
          <Icon className={s.searchIcon} icon="hugeicons:search-01" />
          <input
            className={s.searchInput}
            type="search"
            placeholder="Search validators..."
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </Card>
      <div className={s.list}>
        {filteredValidators.map((validator, i) => (
          <Item key={"validators-" + i} {...validator} />
        ))}
        {filteredValidators.length === 0 && !validatorsIsLoading && (
          <Card auto>
            <div className={s.empty}>
              <Icon icon="hugeicons:sad-02" className={s.sad} />
              <p>No validators found</p>
            </div>
          </Card>
        )}
        {validatorsIsLoading && (
          <Card auto>
            <div className={s.empty}>
              <Icon icon="svg-spinners:clock" className={s.sad} />
              <p>Loading validators</p>
            </div>
          </Card>
        )}
      </div>
    </>
  )
}
