import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { Table, TableCell, TableRow } from "@/components/table"
// import { TOKENS } from "@/config/tokens"
import { ValidatorRow } from "@/types/faker"
// import { TokenWithAmount } from "@/types/Tokens"
import { Row } from "./row"
import { useDelegationInfo } from "@/hooks/useDelegationInfo"
import { Message } from "@/components/message"

export const Active = () => {
  const { delegationsByValidator } = useDelegationInfo()

  const validators: ValidatorRow[] = delegationsByValidator.map(
    (validator) => ({
      address: validator.validatorAddress,
      name: validator.moniker,
      commission: validator.commission,
      apy: validator.apr,
      assets: validator.tokens,
      rewards: validator.rewards,
      rewardsPrice: validator.rewardsPrice
    })
  )

  return (
    <Card auto>
      <Heading icon="hugeicons:coins-bitcoin" title="Active Delegations" />
      <Table>
        <thead>
          <TableRow>
            <TableCell>Validator</TableCell>
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
      {validators.length === 0 && (
        <Message title="Delegations informations" variant="primary">
          No delegation found.
        </Message>
      )}
    </Card>
  )
}
