import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Table, TableCell, TableRow } from "@/components/table"
// import { TOKENS } from "@/config/tokens"
import { ValidatorRow } from "@/types/faker"
// import { TokenWithAmount } from "@/types/Tokens"
import { Row } from "./row"
import { useDelegationInfo } from "@/hooks/useDelegationInfo"

export const Active = () => {
  const { delegationsByValidator } = useDelegationInfo()

  const validators: ValidatorRow[] = delegationsByValidator.map(
    (validator) => ({
      name: validator.moniker,
      commission: validator.commission,
      apy: validator.apr,
      assets: validator.tokens
    })
  )

  return (
    <Card auto>
      <Heading icon="hugeicons:coins-bitcoin" title="Active Delegations" />
      <Table>
        <thead>
          <TableRow>
            <TableCell colSpan={2}>Validator</TableCell>
            <TableCell>Staked Assets</TableCell>
            <TableCell>APY</TableCell>
            {/* <TableCell>Pending Rewards</TableCell>
            <TableCell>Last Reward</TableCell> */}
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
