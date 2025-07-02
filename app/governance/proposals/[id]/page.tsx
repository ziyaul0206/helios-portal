import BackSection from "@/components/back"
import { VoteResults } from "@/components/voteresults"
import { request } from "@/helpers/request"
import { notFound } from "next/navigation"
import styles from "./proposal.module.scss"
import { VotingSection } from "../../(components)/voting-section"

interface TallyResult {
  yes_count: string
  no_count: string
  abstain_count: string
  no_with_veto_count: string
}

interface ProposalData {
  id: number
  proposer: string
  title: string
  summary: string
  status: string
  votingStartTime: string
  votingEndTime: string
  finalTallyResult: TallyResult
}

async function fetchProposalDetail(id: string): Promise<ProposalData | null> {
  try {
    const result = await request<any>("eth_getProposal", [
      `0x${parseInt(id, 10).toString(16)}`
    ])

    console.log(result)
    if (!result) return null

    const {
      id: pid,
      proposer,
      title,
      summary,
      status,
      votingStartTime,
      votingEndTime,
      finalTallyResult
    } = result

    return {
      id: pid,
      proposer,
      title,
      summary,
      status,
      votingStartTime,
      votingEndTime,
      finalTallyResult
    }
  } catch (err) {
    console.error("Error fetching proposal:", err)
    return null
  }
}

// Mock voters data - replace with actual data from your API
const mockVoters = [
  {
    voter: "0x1234...5678",
    voteType: "voted for" as const,
    amount: "1,234.56"
  },
  {
    voter: "0x9876...4321",
    voteType: "voted against" as const,
    amount: "987.65"
  },
  { voter: "0xabcd...efgh", voteType: "voted for" as const, amount: "2,345.67" }
]

export default async function ProposalDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const proposal = await fetchProposalDetail(id)
  if (!proposal) return notFound()

  const yesVotes = BigInt(proposal.finalTallyResult.yes_count || "0")
  const noVotes = BigInt(proposal.finalTallyResult.no_count || "0")
  const totalVotes = yesVotes + noVotes

  const yesPercent =
    totalVotes === 0n ? 0 : Number((yesVotes * 100n) / totalVotes)
  const noPercent = 100 - yesPercent

  // Format votes for VoteResults component
  const forVotes = (Number(yesVotes) / 1e18).toFixed(2) // Assuming 18 decimals
  const againstVotes = (Number(noVotes) / 1e18).toFixed(2)
  const quorum = "4,000,000" // Replace with actual quorum data
  console.log("proposal", proposal)

  return (
    <>
      <BackSection isVisible={true} />
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left side - VoteResults Component */}

          <div className={styles.rightPanel}>
            <div className={styles.card}>
              <div className={styles.header}>
                <h1 className={styles.title}>{proposal.title}</h1>
                <span
                  className={`${styles.status} ${
                    styles[proposal.status.toLowerCase()] || ""
                  }`}
                >
                  {proposal.status}
                </span>
              </div>

              <div className={styles.meta}>
                <p>
                  <strong>Proposer:</strong>{" "}
                  <a
                    href={`https://explorer.helioschainlabs.org/address/${proposal.proposer}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.proposerLink}
                    title="View on Helios Explorer"
                  >
                    {proposal.proposer}
                  </a>
                </p>
                <p>
                  <strong>Voting Start:</strong>{" "}
                  {new Date(proposal.votingStartTime).toLocaleString()}
                </p>
                <p>
                  <strong>Voting End:</strong>{" "}
                  {new Date(proposal.votingEndTime).toLocaleString()}
                </p>
              </div>

              {/* Enhanced Voting Section */}
              <VotingSection
                proposalId={proposal.id}
                status={proposal.status}
                votingEndTime={proposal.votingEndTime}
              />

              <div className={styles.summary}>
                <h2>Summary</h2>
                <p>{proposal.summary}</p>
              </div>
            </div>
          </div>
          {/* Right side - Proposal Details */}
          <div className={styles.leftPanel}>
            <VoteResults
              forVotes={forVotes}
              againstVotes={againstVotes}
              quorum={quorum}
              status={proposal.status as "EXECUTED" | "DEFEATED"}
              endDate={new Date(proposal.votingEndTime).toLocaleDateString()}
              voters={mockVoters}
            />
          </div>
        </div>
      </div>
    </>
  )
}
