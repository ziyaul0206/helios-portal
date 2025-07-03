"use client"

import BackSection from "@/components/back"
import { Heading } from "@/components/heading"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useAccount } from "wagmi"
import { ModalProposal } from "../(components)/proposal/modal"
import styles from "./page.module.scss"
import { request } from "@/helpers/request"

// Updated fetchProposals function using the new request utility
const fetchProposals = async (page: number, pageSize: number) => {
  try {
    const result = await request<any[]>("eth_getProposalsByPageAndSize", [
      `0x${page.toString(16)}`,
      `0x${pageSize.toString(16)}`
    ])

    return result || []
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch proposals")
  }
}

interface Proposal {
  id: string
  title: string
  author: string
  status: string
  type: string
  waitingFor: string
  nextStep: string
}

interface ProposalData {
  id: string
  meta: string
  status: string
  votes: string
  title: string
  result: string
  resultClass: string
  voteFor: string
  voteAgainst: string
}

const MyProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <div>
        <h2 className={styles.proposalTitle}>
          {proposal.title || "Untitled proposal"}
        </h2>
        <p className={styles.proposalAuthor}>By {proposal.author}</p>
      </div>
      <span className={styles.badge}>Draft</span>
    </div>

    <div className={styles.cardMeta}>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>Type</div>
        <div className={styles.metaValue}>{proposal.type || "General"}</div>
      </div>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>Status</div>
        <div className={styles.metaValue}>
          {proposal.waitingFor || "Awaiting submission"}
        </div>
      </div>
    </div>

    <div className={styles.progressSection}>
      <div className={styles.progressLabel}>Next start step</div>
      <div className={styles.progressBar}>
        <div className={styles.filled} />
      </div>
      <div className={styles.progressSteps}>
        <span className={styles.currentStep}>
          {proposal.nextStep || "Submit Draft"}
        </span>
        <span className={styles.upcomingStep}>Vote</span>
      </div>
    </div>

    <div className={styles.cardFooter}>
      <button className={styles.buttonOutline}>Edit Draft</button>
    </div>
  </div>
)

const MyProposals: React.FC = () => {
  const myProposal: Proposal = {
    id: "1",
    title: "WBTC Treasury Proposal",
    author: "0x80C72ec57e33DDF9fdEf9103F284394626a280D",
    status: "Draft",
    type: "[Type pending]",
    waitingFor: "Submitting draft",
    nextStep: "Submit Draft"
  }

  return (
    <div className={styles.myProposalsSection}>
      <Heading
        icon="material-symbols:note-add-outline"
        title="My Proposals"
        className={styles.sectionTitle}
      />
      <MyProposalCard proposal={myProposal} />
    </div>
  )
}

interface ProposalData {
  id: string
  meta: string
  status: string
  votes: string
  title: string
  result: string
  resultClass: string
  voteFor: string
  voteAgainst: string
  voteAbstain: string
  voteNoWithVeto: string
  voteForPercent: string
  voteAgainstPercent: string
  voteAbstainPercent: string
  voteNoWithVetoPercent: string
}

const AllProposals: React.FC = () => {
  const router = useRouter()
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const [loading, setLoading] = useState(false)
  const pageRef = useRef(1)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const { isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false) // Track if we've made the first load attempt
  const [error, setError] = useState<string | null>(null)
  // Add this ref at the top of your component
  const loadingRef = useRef(false)
  const [savedRowDataLength, setSavedRowDataLength] = useState(10)

  const handleCreateProposal = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowModal(true)
    }, 1000)
  }
  const manualProposalCounter = useRef(1) // Counter for manual proposals

  const loadMoreProposals = async () => {
    // Prevent multiple simultaneous calls
    if (loading) return
    if (loadingRef.current) return
    if (savedRowDataLength == 0) return

    loadingRef.current = true
    setLoading(true)
    setError(null) // Clear previous errors
    console.log("Fetched proposals:", pageRef.current)

    try {
      const rawData = await fetchProposals(pageRef.current, 10)

      setHasLoadedInitial(true) // Mark that we've attempted the first load

      if (!rawData || rawData.length === 0) {
        setSavedRowDataLength(0)
        console.log("No more proposals to load")
        // Add a manual proposal immediately when API data is exhausted
        // const newManualProposal = createManualProposals(3)
        // setProposals((prev) => [...prev, ...newManualProposal])
        setLoading(false) // Make sure to set loading to false
        return
      }
      setSavedRowDataLength(rawData.length)

      const newProposals: ProposalData[] = rawData.map((item: any) => {
        const yes = BigInt(item.currentTallyResult?.yes_count || "0")
        const no = BigInt(item.currentTallyResult?.no_count || "0")
        const abstain = BigInt(item.currentTallyResult?.abstain_count || "0")
        const noWithVeto = BigInt(
          item.currentTallyResult?.no_with_veto_count || "0"
        )

        const total = yes + no + abstain + noWithVeto || 1n
        console.log("yyyyyyyyyyyyyyy", yes, (yes / 10n ** 18n).toString())
        const voteForPercent = Number((yes * 100n) / total)
        const voteAgainstPercent = Number((no * 100n) / total)
        const voteAbstainPercent = Number((abstain * 100n) / total)
        const voteNoWithVetoPercent = Number((noWithVeto * 100n) / total)

        // Convert from smallest unit (assuming 18 decimals like your original code)
        const yesFormatted = (yes / 10n ** 18n).toString()
        const noFormatted = (no / 10n ** 18n).toString()
        const abstainFormatted = (abstain / 10n ** 18n).toString()
        const noWithVetoFormatted = (noWithVeto / 10n ** 18n).toString()

        return {
          id: item.id.toString(),
          meta: `By ${item.proposer}`,
          status: `Ends ${new Date(item.votingEndTime).toLocaleString()}`,
          votes: `${yesFormatted} For – ${noFormatted} Against – ${abstainFormatted} Abstain – ${noWithVetoFormatted} No with Vote`,
          title: item.title,
          result: item.status,
          resultClass:
            item.status === "PASSED"
              ? styles.executed
              : item.status === "REJECTED"
              ? styles.rejected
              : styles.voting_period,
          voteFor: `${yesFormatted}HLS`,
          voteAgainst: `${noFormatted}HLS`,
          voteAbstain: `${abstainFormatted}HLS`,
          voteNoWithVeto: `${noWithVetoFormatted}HLS`,
          voteForPercent: `${voteForPercent}%`,
          voteAgainstPercent: `${voteAgainstPercent}%`,
          voteAbstainPercent: `${voteAbstainPercent}%`,
          voteNoWithVetoPercent: `${voteNoWithVetoPercent}%`
        }
      })

      setProposals((prev) => [...prev, ...newProposals])
      pageRef.current += 1
    } catch (error: unknown) {
      console.error("Failed to fetch proposals", error)
      const message =
        error instanceof Error ? error.message : "Failed to load proposals"
      setError(message)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }

  // Use useCallback to memoize the function and prevent unnecessary re-renders
  const loadMoreProposalsCallback = useCallback(loadMoreProposals, [loading])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          loadMoreProposalsCallback()
        }
      },
      {
        threshold: 0.1, // Changed from 1 to 0.1 for better triggering
        rootMargin: "20px" // Add some margin to trigger earlier
      }
    )

    const current = loaderRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [loadMoreProposalsCallback, loading]) // Add dependencies

  // Initial load effect
  useEffect(() => {
    if (!hasLoadedInitial && !loading) {
      loadMoreProposals()
    }
  }, []) // This runs once on mount

  // Show loading state on initial load
  if (!hasLoadedInitial && loading) {
    return (
      <div className={styles["all-proposals"]}>
        <div className={styles.proposalContainer}>
          <Heading
            icon="material-symbols:library-books-outline"
            title="All Proposals"
            className={styles.sectionTitle}
          />
          {isConnected && (
            <button
              className={styles["create-proposal"]}
              onClick={handleCreateProposal}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.myloader}></span>Loading…
                </>
              ) : (
                "Create Proposal"
              )}
            </button>
          )}
        </div>
        <div className={styles["proposal-list"]}>
          <div className={styles.loader}>
            <p>Loading proposals...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if there's an error and no initial data loaded
  if (error && !hasLoadedInitial) {
    return (
      <div className={styles["all-proposals"]}>
        <div className={styles.proposalContainer}>
          <Heading
            icon="material-symbols:library-books-outline"
            title="All Proposals"
            className={styles.sectionTitle}
          />
          {isConnected && (
            <button
              className={styles["create-proposal"]}
              onClick={handleCreateProposal}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.myloader}></span>Loading…
                </>
              ) : (
                "Create Proposal"
              )}
            </button>
          )}
        </div>
        <div className={styles["proposal-list"]}>
          <div className={styles["error-state"]}>
            <h3>Failed to load proposals</h3>
            <p>{error}</p>
            <button
              className={styles["retry-button"]}
              onClick={() => loadMoreProposals()}
              disabled={loading}
            >
              {loading ? "Retrying..." : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles["all-proposals"]}>
        <div className={styles.proposalContainer}>
          <Heading
            icon="material-symbols:library-books-outline"
            title="All Proposals"
            className={styles.sectionTitle}
          />
          {isConnected && (
            <button
              className={styles["create-proposal"]}
              onClick={handleCreateProposal}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.myloader}></span>Loading…
                </>
              ) : (
                "Create Proposal"
              )}
            </button>
          )}
        </div>

        {/* Show error banner if there's an error but we have existing data */}
        {error && hasLoadedInitial && (
          <div className={styles["error-banner"]}>
            <p>{error}</p>
            <button
              className={styles["retry-button-small"]}
              onClick={() => loadMoreProposals()}
              disabled={loading}
            >
              Retry
            </button>
          </div>
        )}

        <div className={styles["proposal-list"]}>
          {proposals.length === 0 && hasLoadedInitial && !loading ? (
            // Empty state when no proposals exist
            <div className={styles["empty-state"]}>
              <h3>No proposals found</h3>
              <p>
                There are currently no proposals to display.{" "}
                {isConnected && "Create the first proposal to get started!"}
              </p>
            </div>
          ) : (
            // Show proposals when they exist
            proposals.map((proposal) => (
              <div
                key={proposal.id}
                className={styles["proposal-card"]}
                onClick={() =>
                  router.push(`/governance/proposals/${proposal.id}`)
                }
              >
                <div className={styles["card-content"]}>
                  <div className={styles["proposal-header"]}>
                    <div className={styles["proposal-info"]}>
                      <div className={styles["proposer-info"]}>
                        <span className={styles["proposer-label"]}>
                          Proposal by
                        </span>
                        <div className={styles["proposer-badge"]}>
                          {
                            <a
                              href={`https://explorer.helioschainlabs.org/address/${proposal.meta.replace(
                                "By ",
                                ""
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.proposerLink}
                              title="View on Helios Explorer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {proposal.meta.replace("By ", "")}
                            </a>
                          }
                        </div>
                      </div>
                      <h3 className={styles["proposal-title"]}>
                        {proposal.title}
                      </h3>
                    </div>
                    <div className={styles["proposal-status"]}>
                      <div className={styles["end-date"]}>
                        {proposal.status}
                      </div>
                      <div
                        className={`${styles["status-badge"]} ${proposal.resultClass}`}
                      >
                        {proposal.result}
                      </div>
                    </div>
                  </div>

                  <div className={styles["vote-section"]}>
                    <div className={styles["vote-bar"]}>
                      <div
                        className={styles["vote-for"]}
                        style={{ width: proposal.voteForPercent }}
                      />
                      <div
                        className={styles["vote-abstain"]}
                        style={{ width: proposal.voteAbstainPercent }}
                      />
                      <div
                        className={styles["vote-against"]}
                        style={{ width: proposal.voteAgainstPercent }}
                      />
                      <div
                        className={styles["vote-no-veto"]}
                        style={{ width: proposal.voteNoWithVetoPercent }}
                      />
                    </div>

                    <div className={styles["vote-details"]}>
                      <div className={styles["vote-stats"]}>
                        <span className={styles["vote-for-text"]}>
                          For: {proposal.voteFor} ({proposal.voteForPercent})
                        </span>
                        <span className={styles["vote-abstain-text"]}>
                          Abstain: {proposal.voteAbstain} (
                          {proposal.voteAbstainPercent})
                        </span>
                        <span className={styles["vote-against-text"]}>
                          Against: {proposal.voteAgainst} (
                          {proposal.voteAgainstPercent})
                        </span>
                        {proposal.voteNoWithVeto !== "0.0%" && (
                          <span className={styles["vote-no-veto-text"]}>
                            No With Veto: {proposal.voteNoWithVeto} (
                            {proposal.voteNoWithVetoPercent})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={loaderRef} className={`${styles.loader}`}>
            {loading && proposals.length > 0 && (
              <p>Loading more proposals...</p>
            )}
          </div>
        </div>
      </div>
      <ModalProposal open={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

// Helper function to format vote counts (you'll need to add this to your component)
const formatVoteCount = (percentage: string): string => {
  // Extract the numeric value from percentage and convert to vote count
  // This is a placeholder - you'll need to implement based on your actual vote data
  const percent = parseFloat(percentage.replace("%", ""))
  // You'll need to calculate actual vote counts based on your data structure
  return `${(percent * 100).toFixed(2)}M` // Placeholder calculation
}

const ProposalDashboard: React.FC = () => {
  const { isConnected } = useAccount()

  return (
    <div className={styles.dashboard}>
      <BackSection isVisible={false} />
      {/* {isConnected && <MyProposals />} */}
      <AllProposals />
    </div>
  )
}

export default ProposalDashboard
