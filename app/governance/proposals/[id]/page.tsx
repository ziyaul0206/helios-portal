import { notFound } from "next/navigation"
import styles from "./proposal.module.scss"

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
    const res = await fetch("http://testnet1.helioschainlabs.org:8545/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getProposal",
        params: [`0x${parseInt(id, 10).toString(16)}`]
      }),
      cache: "no-store"
    })

    const json = await res.json()
    if (!json.result) return null

    const {
      id: pid,
      proposer,
      title,
      summary,
      status,
      votingStartTime,
      votingEndTime,
      finalTallyResult
    } = json.result

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

// ✅ Fixed for Next.js 15 - params is now a Promise
export default async function ProposalDetail({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params to get the actual values
  const { id } = await params

  const proposal = await fetchProposalDetail(id)
  if (!proposal) return notFound()

  const yesVotes = BigInt(proposal.finalTallyResult.yes_count || "0")
  const noVotes = BigInt(proposal.finalTallyResult.no_count || "0")
  const totalVotes = yesVotes + noVotes

  const yesPercent =
    totalVotes === 0n ? 0 : Number((yesVotes * 100n) / totalVotes)
  const noPercent = 100 - yesPercent

  return (
    <div className={styles.container}>
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
            <strong>Proposer:</strong> {proposal.proposer}
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

        <div className={styles.voteSection}>
          <strong>Vote Breakdown:</strong>
          <div className={styles.progressBar}>
            <div
              className={styles.yesBar}
              style={{ width: `${yesPercent}%` }}
            />
            <div className={styles.noBar} style={{ width: `${noPercent}%` }} />
          </div>
          <div className={styles.percentages}>
            <span>Yes: {yesPercent}%</span>
            <span>No: {noPercent}%</span>
          </div>
        </div>

        <div className={styles.summary}>
          <h2>Summary</h2>
          <p>{proposal.summary}</p>
        </div>
      </div>
    </div>
  )
}
