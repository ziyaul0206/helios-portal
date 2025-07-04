"use client"

import Image from "next/image"
import { useAccount } from "wagmi"
import styles from "./VoteResults.module.scss"

export interface VoteResult {
  voter: string
  voteType: "voted for" | "voted against"
  amount: string
}

interface VoteResultsProps {
  forVotes: string
  againstVotes: string
  quorum: string
  status: "EXECUTED" | "DEFEATED"
  endDate: string
  voters: VoteResult[]
}

export function VoteResults({
  forVotes,
  againstVotes,
  quorum, // eslint-disable-line @typescript-eslint/no-unused-vars
  status,
  endDate,
  voters
}: VoteResultsProps) {
  const totalVotes =
    Number.parseFloat(forVotes) + Number.parseFloat(againstVotes)
  const forPercentage =
    totalVotes === 0 ? 0 : (Number.parseFloat(forVotes) / totalVotes) * 100
  const againstPercentage =
    totalVotes === 0 ? 0 : (Number.parseFloat(againstVotes) / totalVotes) * 100
  const abstainPercentage = 100 - forPercentage - againstPercentage

  const { isConnected } = useAccount() // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Proposal votes</h2>

      <div className={styles.content}>
        <div className={styles.voteHeader}>
          <span className={styles.forVotes}>FOR {forVotes} HLS</span>
          <span className={styles.againstVotes}>
            AGAINST {againstVotes} HLS
          </span>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.forBar}
              style={{ width: `${forPercentage}%` }}
            />
            <div
              className={styles.abstainBar}
              style={{ width: `${abstainPercentage}%` }}
            />
            <div
              className={styles.againstBar}
              style={{ width: `${againstPercentage}%` }}
            />
          </div>
        </div>

        {/* <div className={styles.quorum}>Quorum {quorum} HLS</div> */}

        <div
          className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}
        >
          <span>{status}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.endDate}>Ended {endDate}</span>
        </div>

        <div className={styles.votersSection}>
          {/* <div className={styles.votersHeader}>
            <button className={styles.votersButton}>Voters</button>
            <button className={styles.votersButton}>Hasn&apos;t voted</button>
          </div> */}

          <div className={styles.votersList}>
            {voters.map((voter) => (
              <div key={voter.voter} className={styles.voterItem}>
                <div className={styles.voterInfo}>
                  <div className={styles.avatar}>
                    <Image
                      src="/placeholder.svg"
                      alt={voter.voter}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span className={styles.voterAddress}>{voter.voter}</span>
                  <span
                    className={`${styles.voteType} ${
                      voter.voteType === "voted for"
                        ? styles.votedFor
                        : styles.votedAgainst
                    }`}
                  >
                    {voter.voteType}
                  </span>
                </div>
                <span className={styles.voteAmount}>{voter.amount} HLS</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
