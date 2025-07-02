"use client"

import { useState } from "react"
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi"
import { parseAbi } from "viem"
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
  NO_WITH_VETO = 3
}

const voteAbi = parseAbi([
  "function vote(address voter, uint64 proposalId, uint8 option, string metadata) returns (bool success)"
])

const GOVERNANCE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000805"

export function VotingSection({
  proposalId,
  status,
  votingEndTime
}: VotingSectionProps) {
  const { address, isConnected } = useAccount()
  const [selectedVote, setSelectedVote] = useState<VoteOption | null>(null)
  const [voteMetadata, setVoteMetadata] = useState("")

  const {
    data: hash,
    isPending: isVoting,
    writeContract,
    error: writeError
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    })

  const submitVote = async () => {
    if (!address || selectedVote === null) return

    try {
      writeContract({
        address: GOVERNANCE_CONTRACT_ADDRESS,
        abi: voteAbi,
        functionName: "vote",
        args: [
          address,
          BigInt(proposalId),
          selectedVote,
          voteMetadata || `Vote on proposal ${proposalId}`
        ]
      })
    } catch (error) {
      console.error("Error submitting vote:", error)
    }
  }

  // Reset form after successful transaction
  if (isConfirmed && selectedVote !== null) {
    setSelectedVote(null)
    setVoteMetadata("")
  }

  const canVote =
    status === "VOTING_PERIOD" && new Date() < new Date(votingEndTime)

  const getStatusMessage = () => {
    if (status === "DEPOSIT_PERIOD") return "Voting has not started yet"
    if (status === "VOTING_PERIOD" && new Date() >= new Date(votingEndTime))
      return "Voting period has ended"
    if (status === "EXECUTED") return "Proposal has been executed"
    if (status === "DEFEATED") return "Proposal was defeated"
    return null
  }

  const statusMessage = getStatusMessage()

  // Show transaction status messages
  const getTransactionMessage = () => {
    if (isVoting) return { type: "loading", text: "Submitting your vote..." }
    if (isConfirming)
      return { type: "loading", text: "Waiting for confirmation..." }
    if (isConfirmed)
      return { type: "success", text: "Vote submitted successfully!" }
    if (writeError)
      return { type: "error", text: "Failed to submit vote. Please try again." }
    return null
  }

  const transactionMessage = getTransactionMessage()

  return (
    <div className={styles.votingSection}>
      <h3 className={styles.sectionTitle}>Cast Your Vote</h3>

      {statusMessage && (
        <div className={styles.statusMessage}>
          <p>{statusMessage}</p>
        </div>
      )}

      {transactionMessage && (
        <div
          className={`${styles.transactionMessage} ${
            styles[transactionMessage.type]
          }`}
        >
          <p>{transactionMessage.text}</p>
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
                    disabled={isVoting || isConfirming}
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
                    disabled={isVoting || isConfirming}
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
                    disabled={isVoting || isConfirming}
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
                    value={VoteOption.NO_WITH_VETO}
                    checked={selectedVote === VoteOption.NO_WITH_VETO}
                    onChange={() => setSelectedVote(VoteOption.NO_WITH_VETO)}
                    disabled={isVoting || isConfirming}
                  />
                  <span className={`${styles.optionLabel} ${styles.veto}`}>
                    <span className={styles.optionIcon}>🚫</span>
                    No with Veto
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
                  disabled={isVoting || isConfirming}
                />
              </div>

              <button
                className={styles.submitVoteButton}
                onClick={submitVote}
                disabled={selectedVote === null || isVoting || isConfirming}
              >
                {isVoting || isConfirming ? (
                  <span className={styles.loadingContent}>
                    <span className={styles.spinner}></span>
                    {isVoting ? "Submitting..." : "Confirming..."}
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
