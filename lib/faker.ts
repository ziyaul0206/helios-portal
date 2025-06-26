// import { getToken } from "@/config/tokens"
import { ValidatorProps, VoteProps, VoteVote } from "@/types/faker"
import { Token } from "@/types/Tokens"
// import { TransactionDelegation } from "@/types/TransactionDelegation"
// import { Transaction, TransactionStatus } from "@/types/Transactions"
import { faker } from "@faker-js/faker"

faker.seed(6)

// export const generateRandomTransactions = (count: number): Transaction[] => {
//   const transactions: Transaction[] = []

//   const transactionTypes: Transa[] = [
//     "bridge-out",
//     "bridge-in",
//     "governance-vote",
//     "stake-in",
//     "stake-out",
//     "deposit",
//     "withdraw"
//   ]

//   const statuses: TransactionStatus[] = ["pending", "completed", "failed"]
//   const availableTokens = getAllTokens()

//   for (let i = 0; i < count; i++) {
//     const token = faker.helpers.arrayElement(availableTokens)

//     const transaction: Transaction = {
//       id: faker.string.uuid(),
//       type: faker.helpers.arrayElement(transactionTypes),
//       token,
//       amount: Number(faker.finance.amount({ min: 0.1, max: 1000, dec: 4 })),
//       date: faker.date.recent({ days: 30 }).toISOString(),
//       status: faker.helpers.arrayElement(statuses)
//     }

//     transactions.push(transaction)
//   }

//   return transactions.sort(
//     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//   )
// }

export interface TvlData {
  token: Token
  amountLocked: number
}

export const generateRandomTvl = (): TvlData[] => {
  const tvlData: TvlData[] = []

  //   const nativeTokensConfig = [
  //     { symbol: "hls", min: 50, max: 5000000 },
  //     { symbol: "eth", min: 100, max: 80000000 },
  //     { symbol: "matic", min: 30, max: 30000000 },
  //     { symbol: "avax", min: 20, max: 25000000 },
  //     { symbol: "bnb", min: 40, max: 40000000 },
  //     { symbol: "sol", min: 10, max: 1000000 }
  //   ]

  //   nativeTokensConfig.forEach(({ symbol, min, max }) => {
  //     const token = getToken(symbol)
  //     if (token) {
  //       tvlData.push({
  //         token,
  //         amountLocked: Number(faker.finance.amount({ min, max, dec: 2 }))
  //       })
  //     }
  //   })

  return tvlData
}

export const generateRandomValidators = (count: number): ValidatorProps[] => {
  const validators: ValidatorProps[] = []

  for (let i = 0; i < count; i++) {
    const validator: ValidatorProps = {
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      image: faker.image.url(),
      apyBoost: faker.number.int({ min: 1, max: 2 }),
      reputation: faker.number.int({ min: 90, max: 100 }),
      uptime: faker.number.int({ min: 1, max: 100 }),
      commission: faker.number.int({ min: 1, max: 100 })
    }

    validators.push(validator)
  }

  return validators
}

export const generateGovernanceData = () => {
  const proposals = [
    "Increase validator set",
    "Reduce transaction fees",
    "Add new bridge assets",
    "Modify staking rewards",
    "Update governance parameters",
    "Implement new consensus mechanism",
    "Adjust block rewards",
    "Enhance network security",
    "Optimize gas fees",
    "Upgrade smart contracts"
  ]

  return Array.from({ length: 5 }, (_, i) => {
    const proposal = faker.helpers.arrayElement(proposals)
    const result = faker.helpers.arrayElement(["Passed", "Failed"])
    const vote = result === "Passed" ? "For" : "Against"
    const hipNumber = 23 - i

    return {
      id: `HIP-${hipNumber}`,
      title: proposal,
      result,
      vote,
      date: faker.date.recent({ days: 30 }).toISOString().split("T")[0],
      votesFor: faker.number.int({ min: 1000000, max: 5000000 }),
      votesAgainst: faker.number.int({ min: 100000, max: 1000000 }),
      quorum: faker.number.int({ min: 40, max: 60 }),
      turnout: faker.number.int({ min: 30, max: 80 })
    }
  })
}

export const generatePerformanceData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))
    return {
      date: date.toISOString().split("T")[0],
      value: faker.number.float({ min: 99.5, max: 100 })
    }
  })
}

// export const generateTransactionsDelegations = (
//   number: number = 10
// ): TransactionDelegation[] => {
//   const types = [1, 2, 3]
//   const status = [1, 2, 3]

//   return Array.from({ length: number }, () => ({
//     type: faker.helpers.arrayElement(types),
//     validator: faker.helpers.arrayElement([
//       "Helios Guardian",
//       "Cosmic Validator",
//       "Quantum Nodes",
//       "Stellar Validator",
//       "Nova Network"
//     ]),
//     amount: faker.number.int({ min: 50, max: 1000 }),
//     status: faker.helpers.arrayElement(status),
//     date: faker.date.recent({ days: 30 }).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric"
//     }),
//     explorer: `https://explorer.helios.network/tx/${faker.string.uuid()}`
//   }))
// }

export const generateVotes = (count: number): VoteProps[] => {
  faker.seed(10)

  return Array.from({ length: count }, () => ({
    status: faker.helpers.arrayElement(["active", "passed", "rejected"]),
    name: faker.company.name(),
    hip: faker.number.int({ min: 1, max: 100 }),
    date: faker.date.recent({ days: 30 }).toISOString().split("T")[0],
    vote: faker.helpers.arrayElement([
      "yes",
      "no",
      "abstain",
      "veto"
    ]) as VoteVote
  }))
}
