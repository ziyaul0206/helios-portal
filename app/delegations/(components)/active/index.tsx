import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Table, TableCell, TableRow } from "@/components/table"
import { TOKENS } from "@/config/tokens"
import { ValidatorRow } from "@/types/faker"
import { TokenWithAmount } from "@/types/Tokens"
import { Row } from "./row"

export const Active = () => {
  const validators: ValidatorRow[] = [
    {
      name: "Helios Guardian",
      commission: 5,
      apy: 12.5,
      base: 8.5,
      assets: [
        {
          ...TOKENS.get("hls"),
          amount: 1000,
          priceUsd: 5000
        },
        {
          ...TOKENS.get("eth"),
          amount: 0.5,
          priceUsd: 850
        }
      ] as TokenWithAmount[],
      rewards: 42.8
    },
    {
      name: "Cosmic Validator",
      commission: 7,
      apy: 10.5,
      base: 7.8,
      assets: [
        {
          ...TOKENS.get("hls"),
          amount: 1000,
          priceUsd: 5000
        }
      ] as TokenWithAmount[],
      rewards: 18.5
    }
  ]

  return (
    <Card auto>
      <Heading icon="hugeicons:coins-bitcoin" title="Active Delegations" />
      <Table>
        <thead>
          <TableRow>
            <TableCell colSpan={2}>Validator</TableCell>
            <TableCell>Staked Assets</TableCell>
            <TableCell>APY</TableCell>
            <TableCell>Pending Rewards</TableCell>
            <TableCell>Last Reward</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </thead>
        <tbody>
          {validators.map((validator, index) => (
            <Row key={index} {...validator} />
          ))}
        </tbody>
      </Table>
    </Card>
  )
}
