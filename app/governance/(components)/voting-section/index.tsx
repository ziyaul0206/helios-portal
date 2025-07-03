"use client"

import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useVote } from "@/hooks/useVote"
import { toast } from "sonner"
import styles from "./voting-section.module.scss"

interface VotingSectionProps {
  proposalId: number
  status: string
  votingEndTime: string
}

// Vote options enum matching your smart contract
enum VoteOption {
  NO = 0,
  YES = 1,
  ABSTAIN = 2,
  NO_WITH_VOTE = 3
}

export function VotingSection({
  proposalId,
  status,
  votingEndTime
}: VotingSectionProps) {
  const { address, isConnected } = useAccount()
  const { vote, feedback, resetFeedback, isLoading } = useVote()
  const [selectedVote, setSelectedVote] = useState<VoteOption | null>(null)
  const [voteMetadata, setVoteMetadata] = useState("")

  const submitVote = async () => {
    if (!address || selectedVote === null) return

    try {
      await vote(proposalId, selectedVote, voteMetadata)
    } catch (error) {
      console.error("Error submitting vote:", error)
    }
  }

  // Handle toast notifications based on feedback status
  useEffect(() => {
    if (!feedback.message) return

    const handleToast = async () => {
      if (feedback.status === "primary" && isLoading) {
        toast.loading(feedback.message, { id: "vote-status" })
      } else if (feedback.status === "success") {
        toast.success(feedback.message, { id: "vote-status" })
        // Reset form on success
        setSelectedVote(null)
        setVoteMetadata("")
      } else if (feedback.status === "danger") {
        toast.error(feedback.message, { id: "vote-status" })
      }

      // Reset feedback after handling
      setTimeout(() => resetFeedback(), 100)
    }

    handleToast()
  }, [feedback, isLoading, resetFeedback])

  const canVote =
    status === "VOTING_PERIOD" && new Date() < new Date(votingEndTime)
  // const canVote = status === "REJECTED"

  const getStatusMessage = () => {
    if (status === "DEPOSIT_PERIOD") return "Voting has not started yet"
    if (status === "VOTING_PERIOD" && new Date() >= new Date(votingEndTime))
      return "Voting period has ended"
    if (status === "EXECUTED") return "Proposal has been executed"
    if (status === "REJECTED") return "Proposal was rejected"
    return null
  }

  const statusMessage = getStatusMessage()

  return (
    <div className={styles.votingSection}>
      <h3 className={styles.sectionTitle}>Cast Your Vote</h3>

      {statusMessage && (
        <div className={styles.statusMessage}>
          <p>{statusMessage}</p>
        </div>
      )}

      {!isConnected ? (
        <div className={styles.walletPrompt}>
          <div className={styles.promptContent}>
            <div className={styles.promptIcon}>🔗</div>
            <h4 className={styles.promptTitle}>Connect Your Wallet</h4>
            <p className={styles.promptText}>
              Please connect your wallet using the button in the header to
              participate in governance voting.
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.connectedWallet}>
          <div className={styles.walletInfo}>
            <span className={styles.walletIndicator}>✅</span>
            <span>Connected: </span>
            <span className={styles.address}>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>

          {canVote && (
            <div className={styles.voteForm}>
              <div className={styles.voteOptions}>
                <label className={styles.voteOption}>
                  <input
                    type="radio"
                    name="voteOption"
                    value={VoteOption.YES}
                    checked={selectedVote === VoteOption.YES}
                    onChange={() => setSelectedVote(VoteOption.YES)}
                    disabled={isLoading}
                  />
                  <span className={`${styles.optionLabel} ${styles.yes}`}>
                    <span className={styles.optionIcon}>✅</span>
                    Vote Yes
                  </span>
                </label>

                <label className={styles.voteOption}>
                  <input
                    type="radio"
                    name="voteOption"
                    value={VoteOption.NO}
                    checked={selectedVote === VoteOption.NO}
                    onChange={() => setSelectedVote(VoteOption.NO)}
                    disabled={isLoading}
                  />
                  <span className={`${styles.optionLabel} ${styles.no}`}>
                    <span className={styles.optionIcon}>❌</span>
                    Vote No
                  </span>
                </label>

                <label className={styles.voteOption}>
                  <input
                    type="radio"
                    name="voteOption"
                    value={VoteOption.ABSTAIN}
                    checked={selectedVote === VoteOption.ABSTAIN}
                    onChange={() => setSelectedVote(VoteOption.ABSTAIN)}
                    disabled={isLoading}
                  />
                  <span className={`${styles.optionLabel} ${styles.abstain}`}>
                    <span className={styles.optionIcon}>⚪</span>
                    Abstain
                  </span>
                </label>

                <label className={styles.voteOption}>
                  <input
                    type="radio"
                    name="voteOption"
                    value={VoteOption.NO_WITH_VOTE}
                    checked={selectedVote === VoteOption.NO_WITH_VOTE}
                    onChange={() => setSelectedVote(VoteOption.NO_WITH_VOTE)}
                    disabled={isLoading}
                  />
                  <span className={`${styles.optionLabel} ${styles.novote}`}>
                    <span className={styles.optionIcon}>🚫</span>
                    No with Vote
                  </span>
                </label>
              </div>

              <div className={styles.metadataSection}>
                <label htmlFor="voteMetadata" className={styles.metadataLabel}>
                  Vote Comment (Optional):
                </label>
                <textarea
                  id="voteMetadata"
                  className={styles.metadataInput}
                  value={voteMetadata}
                  onChange={(e) => setVoteMetadata(e.target.value)}
                  placeholder="Add a comment about your vote..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <button
                className={styles.submitVoteButton}
                onClick={submitVote}
                disabled={selectedVote === null || isLoading}
              >
                {isLoading ? (
                  <span className={styles.loadingContent}>
                    <span className={styles.spinner}></span>
                    Submitting...
                  </span>
                ) : (
                  "Submit Vote"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
